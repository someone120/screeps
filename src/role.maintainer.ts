import { creep } from './base';
export class Repairer extends Creep implements creep {
    task: String;
    type: Number = 4;
    work() {
        if (this.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            if (this.room.storage) {
                if (
                    this.withdraw(this.room.storage, RESOURCE_ENERGY) ==
                    ERR_NOT_IN_RANGE
                ) {
                    this.moveTo(this.room.storage);
                }
            } else {
                const source2 = this.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            structure.structureType == STRUCTURE_CONTAINER &&
                            structure.store.energy > 0
                        );
                    },
                }) as StructureContainer[]
                source2.sort((a,b)=>{return b.store.energy-a.store.energy});

                if (source2.length!=0) {
                    const result = this.withdraw(source2[0], RESOURCE_ENERGY);

                    if (result == ERR_NOT_IN_RANGE) {
                        this.moveTo(source2[0]);
                    }
                } else {
                    const source1 = this.room.find(FIND_DROPPED_RESOURCES)[0];
                    if (this.pickup(source1) == ERR_NOT_IN_RANGE) {
                        this.moveTo(source1, {
                            visualizePathStyle: { stroke: '#ffaa00' },
                        });
                    }
                }
            }
        } else {
            let target = this.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        structure.hitsMax - structure.hits &&
                        structure.hits < 100000 &&
                        structure.hitsMax - structure.hits > 0
                    );
                },
            })[0];
            let res = this.repair(target);
            if (res == ERR_NOT_IN_RANGE) {
                this.moveTo(target, {
                    visualizePathStyle: { stroke: '#ffff99' },
                });
            }

            // if (!global['all']) global['all'] = target.length;
            // if (Memory['type'][4] == 1) console.log(global['all'] - target.length + ":" + global['all']);
        }
        let constructions = this.room.find(FIND_CONSTRUCTION_SITES);
        if (~~(constructions.length * 2.5) > Memory['type'][1]) {
            Memory['type'][1]++;
            Memory['type'][4]--;
            this.memory['type'] = 1;
        }
    }
}
