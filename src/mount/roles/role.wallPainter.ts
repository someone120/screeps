import { creepExt } from 'base';
import { isContainer, isStorage } from 'GameUtils';

export class WallPainter extends creepExt {
    task: string | undefined;
    type: Number = 11;
    work() {
        super.work()
        if (this.store.getUsedCapacity() == 0) {
            this.room.removeRestrictedPos(this.name)
            let target:
                | StructureContainer
                | StructureStorage
                | Resource
                | undefined =
                this.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                    filter: (it) => {
                        return it.resourceType == RESOURCE_ENERGY;
                    }
                }) ||
                (this.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (it) => {
                        return (
                            it.structureType == STRUCTURE_CONTAINER &&
                            it.store[RESOURCE_ENERGY] > 0
                        );
                    }
                }) as StructureContainer) ||
                (this.room.storage &&
                    this.room.storage.store[RESOURCE_ENERGY] > 0
                    ? this.room.storage
                    : undefined);
            // console.log(target);

            if (target) {
                if (isContainer(target)) {
                    this.withdraw(target, RESOURCE_ENERGY);
                } else if (isStorage(target)) {
                    this.withdraw(target, RESOURCE_ENERGY);
                } else {
                    this.pickup(target);
                }
                this.goTo(target.pos);
            }
            this.memory.standed = false;

            return;
        }
        if (Memory.lessWallId && Memory.lessWallId[this.memory['roomID']]) {
            let wall = Game.getObjectById<StructureWall>(
                Memory.lessWallId[this.memory['roomID']].id
            );
            if (!wall) {
                return;
            }
            let res = this.repair(wall);
            if (res == ERR_NOT_IN_RANGE) {
                this.goTo(wall.pos);
            }
            if (res == OK) {
                this.memory.standed = true;
                this.room.addRestrictedPos(this.name, this.pos);
            }
            if (Game.time > Memory.lessWallId[this.memory['roomID']].ttl) {
                delete Memory.lessWallId[this.memory['roomID']];
            }
            this.say('粉刷本领强~');
            return;
        }
        let wall: StructureWall[] = Game.rooms[this.memory['roomID']].find(
            FIND_STRUCTURES,
            {
                filter: (it) => {
                    return (
                        (it.structureType == STRUCTURE_WALL ||
                            it.structureType == STRUCTURE_RAMPART) &&
                        it.hits < it.hitsMax
                    );
                }
            }
        ) as StructureWall[];
        if (wall && wall.length > 0) {
            wall.sort((a, b) => {
                return a.hits - b.hits;
            });
            if (!Memory.lessWallId) {

                Memory.lessWallId = {};
            }
            Memory.lessWallId[this.memory['roomID']] = {
                id: wall[0].id,
                ttl: Game.time + 300
            };
        } else {
            this.memory.type = 1
        }
    }
}
