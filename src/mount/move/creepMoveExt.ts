//@ts-nocheck
import _ from 'lodash';
import { getOppositeDirection } from 'utils';

export class creepMoveExt extends Creep {
    public goTo(
        target: RoomPosition,
        opts?: MoveToOpts
    ): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND {
        // const baseCost = Game.cpu.getUsed()
        const moveResult = this.moveTo(
            target,
            _.assign(
                {
                    reusePath: 20,
                    costCallback: (roomName:string, costMatrix:CostMatrix) => {
                        if (roomName === this.room.name) {
                            // 避开房间中的禁止通行点
                            const restrictedPos = this.room.getRestrictedPos();
                            for (const creepName in restrictedPos) {
                                // 自己注册的禁止通行点位自己可以走
                                if (creepName === this.name) continue;
                                if (!Game.creeps[creepName]) {
                                    this.room.removeRestrictedPos(creepName);
                                    continue;
                                }
                                const pos = this.room.unserializePos(
                                    restrictedPos[creepName]
                                )!;
                                costMatrix.set(pos.x, pos.y, 0xff);
                                this.room.find(FIND_MY_CREEPS).forEach((it)=>{
                                    costMatrix.set(it.pos.x, it.pos.y, 0xff);
                                })
                            }
                        }
                        // for (let i = 0; i <= 49; i++) {
                        //     costMatrix.set(0, i, 0xff);
                        //     costMatrix.set(i, 0, 0xff);
                        //     costMatrix.set(49, i, 0xff);
                        //     costMatrix.set(i, 49, 0xff);
                        // }
                        return costMatrix;
                    },
                },
                opts
            )
        );

        return moveResult;
    }
    /**
     * 远程寻路
     * 包含对穿功能，会自动躲避 bypass 中配置的绕过房间
     *
     * @param target 要移动到的位置对象
     * @param range 允许移动到目标周围的范围
     */
    public farMoveTo(
        target: RoomPosition,
        range: number = 0
    ):
        | CreepMoveReturnCode
        | ERR_NO_PATH
        | ERR_NOT_IN_RANGE
        | ERR_INVALID_TARGET {
        if (this.memory.farMove == undefined) this.memory.farMove = {};
        // 确认目标有没有变化, 变化了则重新规划路线
        const targetPosTag = this.room.serializePos(target);
        if (targetPosTag !== this.memory.farMove.targetPos) {
            this.memory.farMove.targetPos = targetPosTag;
            this.memory.farMove.path = this.findPath(target, range);
        }
        // 确认缓存有没有被清除
        if (!this.memory.farMove.path) {
            this.memory.farMove.path = this.findPath(target, range);
        }

        // 还为空的话就是没找到路径
        if (!this.memory.farMove.path) {
            delete this.memory.farMove.path;
            return OK;
        }

        // 使用缓存进行移动
        const goResult = this.goByCache();

        // 如果发生撞停或者参数异常的话说明缓存可能存在问题，移除缓存
        if (goResult === ERR_INVALID_TARGET || goResult == ERR_INVALID_ARGS) {
            delete this.memory.farMove.path;
        }
        // 其他异常直接报告
        else if (goResult != OK && goResult != ERR_TIRED)
            this.say(`远程寻路 ${goResult}`);

        return goResult;
    }
    public findPath(target: RoomPosition, range: number): string | null {
        if (!this.memory.farMove) this.memory.farMove = {};
        this.memory.farMove.index = 0;

        // 先查询下缓存里有没有值
        const routeKey = `${this.room.serializePos(
            this.pos
        )} ${this.room.serializePos(target)}`;
        if (!global.routeCache) {
            global.routeCache = {};
        }
        let route = global.routeCache[routeKey];
        // 如果有值则直接返回
        if (route) {
            return route;
        }

        const result = PathFinder.search(
            this.pos,
            { pos: target, range },
            {
                plainCost: 2,
                swampCost: 10,
                maxOps: 4000,
                roomCallback: (roomName) => {
                    // 强调了不许走就不走
                    if (
                        Memory.bypassRooms &&
                        Memory.bypassRooms.includes(roomName)
                    )
                        return false;

                    const room = Game.rooms[roomName];
                    // 房间没有视野
                    if (!room) return;

                    let costs = new PathFinder.CostMatrix();

                    room.find(FIND_STRUCTURES).forEach((struct) => {
                        if (struct.structureType === STRUCTURE_ROAD) {
                            costs.set(struct.pos.x, struct.pos.y, 1);
                        }
                        // 不能穿过无法行走的建筑
                        else if (
                            struct.structureType !== STRUCTURE_CONTAINER &&
                            (struct.structureType !== STRUCTURE_RAMPART ||
                                !struct.my)
                        )
                            costs.set(struct.pos.x, struct.pos.y, 0xff);
                            
                    });

                    // 避开房间中的禁止通行点
                    const restrictedPos = room.getRestrictedPos();
                    for (const creepName in restrictedPos) {
                        // 自己注册的禁止通行点位自己可以走
                        if (creepName === this.name) continue;
                        if (!Game.creeps[creepName]) {
                            this.room.removeRestrictedPos(creepName);
                            continue;
                        }
                        const pos = room.unserializePos(
                            restrictedPos[creepName]
                        );
                        costs.set(pos.x, pos.y, 0xff);
                    }

                    return costs;
                },
            }
        );

        // 寻路失败就通知玩家
        // if (result.incomplete) {
        //     const states = [
        //         `[${this.name} 未完成寻路] [游戏时间] ${Game.time} [所在房间] ${this.room.name}`,
        //         `[creep 内存]`,
        //         JSON.stringify(this.memory, null, 4),
        //         `[寻路结果]`,
        //         JSON.stringify(result)
        //     ]
        //     Game.notify(states.join('\n'))
        // }

        // 没找到就返回 null
        if (result.path.length <= 0) return null;
        // 找到了就进行压缩
        route = this.serializeFarPath(result.path);
        // 保存到全局缓存
        if (!result.incomplete) global.routeCache[routeKey] = route;

        return route;
    }
    public serializeFarPath(positions: RoomPosition[]): string {
        if (positions.length == 0) return '';
        // 确保路径的第一个位置是自己的当前位置
        if (!positions[0].isEqualTo(this.pos)) positions.splice(0, 0, this.pos);

        return positions
            .map((pos, index) => {
                // 最后一个位置就不用再移动
                if (index >= positions.length - 1) return null;
                // 由于房间边缘地块会有重叠，所以这里筛除掉重叠的步骤
                if (pos.roomName != positions[index + 1].roomName) return null;
                // 获取到下个位置的方向
                return pos.getDirectionTo(positions[index + 1]);
            })
            .join('');
    }
    public goByCache():
        | CreepMoveReturnCode
        | ERR_NO_PATH
        | ERR_NOT_IN_RANGE
        | ERR_INVALID_TARGET {
        if (!this.memory.farMove) return ERR_NO_PATH;

        const index = this.memory.farMove.index;
        // 移动索引超过数组上限代表到达目的地
        if (index >= this.memory.farMove.path.length) {
            delete this.memory.farMove.path;
            return OK;
        }

        // 获取方向，进行移动
        const direction = <DirectionConstant>(
            Number(this.memory.farMove.path[index])
        );
        const goResult = this.move(direction);

        // 移动成功，更新下次移动索引
        if (goResult == OK&&this.pos.serializePos()!=this.memory.prePos) this.memory.farMove.index++;
        if(this.pos.serializePos()==this.memory.prePos&&this.fatigue==0) delete this.memory.farMove.path;

        return goResult;
    }
    public move(
        target: DirectionConstant | Creep,
        isCross?:boolean=false
    ): CreepMoveReturnCode | ERR_INVALID_TARGET | ERR_NOT_IN_RANGE {
        // const baseCost = Game.cpu.getUsed()
        // 进行移动，并分析其移动结果，OK 时才有可能发生撞停
        if (isCross&&this.memory.haveMove) {
            return OK;
        }
        const moveResult = this._move(target);

        if (moveResult != OK || target instanceof Creep) return moveResult;

        const currentPos = `${this.pos.x}/${this.pos.y}`;
        // 如果和之前位置重复了就分析撞上了啥
        if (this.memory.prePos && currentPos == this.memory.prePos) {
            // 尝试对穿，如果自己禁用了对穿的话则直接重新寻路
            const crossResult = this.memory.disableCross
                ? ERR_BUSY
                : this.mutualCross(target);

            // 没找到说明撞墙上了或者前面的 creep 拒绝对穿，重新寻路
            if (crossResult != OK) {
                delete this.memory._move;
                return ERR_INVALID_TARGET;
            }
        }

        // 没有之前的位置或者没重复就正常返回 OK 和更新之前位置
        this.memory.prePos = currentPos;
        this.memory.haveMove = true;
        return OK;
    }
    public mutualCross(
        direction: DirectionConstant
    ): OK | ERR_BUSY | ERR_NOT_FOUND {
        const fontPos = this.directionToPos(this.pos, direction);
        if (!fontPos) return ERR_NOT_FOUND;

        const fontCreep =
            fontPos.lookFor(LOOK_CREEPS)[0] ||
            fontPos.lookFor(LOOK_POWER_CREEPS)[0];
        if (!fontCreep) return ERR_NOT_FOUND;

        this.say(`👉`);
        // 如果前面的 creep 同意对穿了，自己就朝前移动
        if (fontCreep.requireCross(getOppositeDirection(direction)))
            this._move(direction);
        else return;

        return OK;
    }
    public requireCross(direction: DirectionConstant): Boolean {
        // this 下没有 memory 说明 creep 已经凉了，直接移动即可
        if (!this.memory) return true;

        // 拒绝对穿
        if (this.memory.standed) {
            this.say('👊');
            return false;
        }

        // 同意对穿
        this.say('👌');
        this.move(direction,true);
        return true;
    }

    public directionToPos(
        pos: RoomPosition,
        direction: DirectionConstant
    ): RoomPosition | undefined {
        let targetX = pos.x;
        let targetY = pos.y;

        // 纵轴移动，方向朝下就 y ++，否则就 y --
        if (direction !== LEFT && direction !== RIGHT) {
            if (direction > LEFT || direction < RIGHT) targetY--;
            else targetY++;
        }
        // 横轴移动，方向朝右就 x ++，否则就 x --
        if (direction !== TOP && direction !== BOTTOM) {
            if (direction < BOTTOM) targetX++;
            else targetX--;
        }

        // 如果要移动到另一个房间的话就返回空，否则返回目标 pos
        if (targetX < 0 || targetY > 49 || targetX > 49 || targetY < 0)
            return undefined;
        else return new RoomPosition(targetX, targetY, pos.roomName);
    }
}
