import { creepExt } from 'base';
import { getSourceFlags } from 'utils';
export class Repairer extends Creep implements creepExt {
    task: string;
    type: Number = 4;
    work() {
        let flag = getSourceFlags();
        if (this.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            if (this.room.storage) {
                if (
                    this.withdraw(this.room.storage, RESOURCE_ENERGY) ==
                    ERR_NOT_IN_RANGE
                ) {
                    this.goTo(this.room.storage.pos);
                }
            } else {
                const source2 = this.pos.findClosestByRange(
                    FIND_STRUCTURES,
                    {
                        filter: (structure) => {
                            return (
                                structure.structureType ==
                                    STRUCTURE_CONTAINER &&
                                structure.store.energy > 0
                            );
                        }
                    }
                )
                
                if (source2) {
                    const result = this.withdraw(source2, RESOURCE_ENERGY);
                    if (result == ERR_NOT_IN_RANGE) {
                        this.goTo(source2.pos);
                    }
                } else {
                    const source1 = this.pos.findClosestByRange(
                        FIND_DROPPED_RESOURCES
                    );
                    if (this.pickup(source1) == ERR_NOT_IN_RANGE) {
                        this.goTo(source1.pos);
                    }
                }
            }
        } else {
            let target = this.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (it) => {
                    return (
                        it.hits < 100000 &&
                        it.hitsMax - it.hits > 0 &&
                        it.structureType != STRUCTURE_WALL
                    );
                }
            });
            if (target) {
                let res = this.repair(target);
                if (res == ERR_NOT_IN_RANGE) {
                    this.goTo(target.pos);
                }
                return;
            }
            let targets = Game.rooms[this.memory['roomID']].find(
                FIND_STRUCTURES,
                {
                    filter: (it) => {
                        return (
                            it.hits < 100000 &&
                            it.hitsMax - it.hits > 0 &&
                            it.structureType != STRUCTURE_WALL
                        );
                    }
                }
            );
            if (targets.length > 0) {
                let target = targets[0];
                let res = this.repair(target);
                if (res == ERR_NOT_IN_RANGE) {
                    this.goTo(target.pos);
                }
                return;
            }
            targets = [];
            flag.forEach((it) => {
                if (!it.room) {
                    return;
                }
                targets = targets.concat(
                    it.room.find(FIND_STRUCTURES, {
                        filter: (it) => {
                            return (
                                it.hits < 100000 &&
                                it.hitsMax - it.hits > 0 &&
                                it.structureType != STRUCTURE_WALL &&
                                it.structureType != STRUCTURE_INVADER_CORE
                            );
                        }
                    })
                );
            });

            if (targets.length > 0) {
                let target = targets[0];
                let res = this.repair(target);
                if (res == ERR_NOT_IN_RANGE) {
                    this.goTo(target.pos);
                }
                return;
            }

            // if (!global['all']) global['all'] = target.length;
            // if (Memory.type[this.memory.roomID][4] == 1) console.log(global['all'] - target.length + ":" + global['all']);
        }
        let constructions = Game.rooms[this.memory['roomID']].find(
            FIND_CONSTRUCTION_SITES
        );
        flag.forEach((it) => {
            if (it.room) {
                constructions = constructions.concat(
                    it.room.find(FIND_CONSTRUCTION_SITES)
                );
            }
        });
        if (
            ~~(constructions.length * 2.5) >
                Memory.type[this.memory.roomID][1] &&
            Memory.type[this.memory.roomID][4] >= 2
        ) {
            Memory.type[this.memory.roomID][1]++;
            Memory.type[this.memory.roomID][4]--;
            this.memory.type = 1;
        }
    }
}
