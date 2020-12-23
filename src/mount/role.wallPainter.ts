import { creepExt } from 'base';

export class WallPainter extends Creep implements creepExt {
    task: string;
    type: Number = 11;
    work() {
        if (this.store.getUsedCapacity() == 0) {
            if (
                this.withdraw(
                    Game.rooms[this.memory['roomID']].storage &&
                        Game.rooms[this.memory['roomID']].storage.store[
                            RESOURCE_ENERGY
                        ] > 0
                        ? Game.rooms[this.memory.roomID].storage
                        : undefined,
                    RESOURCE_ENERGY
                ) == ERR_NOT_IN_RANGE
            ) {
                this.goTo(Game.rooms[this.memory['roomID']].storage.pos);
            }
            return;
        }
        if (Memory.lessWallId[this.memory['roomID']]) {
            let wall = Game.getObjectById<StructureWall>(
                Memory.lessWallId[this.memory['roomID']].id
            );
            let res = this.repair(wall);
            if (res == ERR_NOT_IN_RANGE) {
                this.goTo(wall.pos);
            }
            if (Game.time > Memory.lessWallId[this.memory['roomID']].ttl) {
                Memory.lessWallId[this.memory['roomID']] = undefined;
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
                },
            }
        ) as StructureWall[];
        wall.sort((a, b) => {
            return a.hits - b.hits;
        });
        Memory.lessWallId[this.memory['roomID']] = {
            id: wall[0].id,
            ttl: Game.time + 300,
        };
    }
}
