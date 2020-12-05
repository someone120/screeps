import { getOppositeDirection } from 'utils';

export class creepMoveExt extends Creep {
    public goTo(
        target: RoomPosition
    ): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND {
        // const baseCost = Game.cpu.getUsed()
        const moveResult = this.moveTo(target, {
            reusePath: 20,
            ignoreCreeps: true,
            costCallback: (roomName, costMatrix) => {
                
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
                        );
                        costMatrix.set(pos.x, pos.y, 0xff);
                    }
                }

                return costMatrix;
            }
        });

        return moveResult;
    }
    public findPath(target: RoomPosition, range: number): string | null {
        if (!this.memory.farMove) this.memory.farMove = {};
        this.memory.farMove.index = 0;

        // 先查询下缓存里有没有值
        const routeKey = `${this.room.serializePos(
            this.pos
        )} ${this.room.serializePos(target)}`;
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
                        const pos = room.unserializePos(
                            restrictedPos[creepName]
                        );
                        costs.set(pos.x, pos.y, 0xff);
                    }

                    return costs;
                }
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
        if (goResult == OK) this.memory.farMove.index++;

        return goResult;
    }
    public move(
        target: DirectionConstant | Creep
    ): CreepMoveReturnCode | ERR_INVALID_TARGET | ERR_NOT_IN_RANGE {
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
        this._move(direction);
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