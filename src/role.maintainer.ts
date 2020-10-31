import { creep } from './base';
import { getFlags } from './util';
export class Repairer extends Creep implements creep {
    task: string;
    type: Number = 4;
    work() {
        let flag = getFlags();
        if (this.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            if (this.room.storage) {
                if (
                    this.withdraw(this.room.storage, RESOURCE_ENERGY) ==
                    ERR_NOT_IN_RANGE
                ) {
                    this.moveTo(this.room.storage);
                }
            } else {
                const source2 = Game.rooms[this.memory['roomID']].find(
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
                ) as StructureContainer[];
                source2.sort((a, b) => {
                    return b.store.energy - a.store.energy;
                });
                if (source2.length != 0) {
                    const result = this.withdraw(source2[0], RESOURCE_ENERGY);
                    if (result == ERR_NOT_IN_RANGE) {
                        this.moveTo(source2[0]);
                    }
                } else {
                    const source1 = Game.rooms[this.memory['roomID']].find(
                        FIND_DROPPED_RESOURCES
                    )[0];
                    if (this.pickup(source1) == ERR_NOT_IN_RANGE) {
                        this.moveTo(source1, {
                            visualizePathStyle: { stroke: '#ffaa00' }
                        });
                    }
                }
            }
        } else {
            let targets = Game.rooms[this.memory['roomID']].find(
                FIND_STRUCTURES,
                {
                    filter: (structure) => {
                        return (
                            structure.hits < 100000 &&
                            structure.hitsMax - structure.hits > 0
                        );
                    }
                }
            );
            flag.forEach((it) => {
                if (!it.room) {
                    return;
                }
                targets = targets.concat(
                    it.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (
                                structure.hits < 100000 &&
                                structure.hitsMax - structure.hits > 0
                            );
                        }
                    })
                );
            });
            let target = targets[0];
            let res = this.repair(target);
            if (res == ERR_NOT_IN_RANGE) {
                this.moveTo(target, {
                    visualizePathStyle: { stroke: '#ffff99' }
                });
            }
            // if (!global['all']) global['all'] = target.length;
            // if (Memory['type'][4] == 1) console.log(global['all'] - target.length + ":" + global['all']);
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
        if (~~(constructions.length * 2.5) > Memory['type'][1]) {
            Memory['type'][1]++;
            Memory['type'][4]--;
            this.memory['type'] = 1;
        }
    }
}
