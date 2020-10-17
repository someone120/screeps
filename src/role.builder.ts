import { creep } from './base';
export class builder extends Creep implements creep {
    task: String;
    type: Number = 1;
    /** @param {Creep} this **/
    work() {
        if (this.memory['building'] && this.store[RESOURCE_ENERGY] == 0) {
            this.memory['building'] = false;
            this.say('🔄 harvest');
        }
        if (!this.memory['building'] && this.store.getFreeCapacity() == 0) {
            this.memory['building'] = true;
            this.say('🚧 build');
        }
        let targets = this.room.find(FIND_CONSTRUCTION_SITES);
        let flag =
            Game.flags[
                Object.keys(Game.flags).find((v) => {
                    return v.split(' ')[0] == 'RemoteSource';
                })
            ];
        if (flag.room) {
            targets = targets.concat(flag.room.find(FIND_CONSTRUCTION_SITES));
        }
        if (this.memory['building']) {
            if (targets.length >= 0) {
                if (this.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    this.moveTo(targets[0], {
                        visualizePathStyle: { stroke: '#ffffff' },
                    });
                }
            }
        } else {
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
                }) as StructureContainer[];
                source2.sort((a, b) => {
                    return b.store.energy - a.store.energy;
                });

                if (source2.length != 0) {
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
        }
        if (~~(targets.length * 2.5) < Memory['type'][1]) {
            Memory['type'][1]--;
            Memory['type'][4]++;
            this.memory['type'] = 4;
        }
    }
}
