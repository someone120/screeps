import { base, creep } from './base';
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
        if (this.memory['building']) {
            if (targets.length >= 0) {
                if (
                    this.build(targets[Memory['type'][1] % targets.length]) ==
                    ERR_NOT_IN_RANGE
                ) {
                    this.moveTo(targets[Memory['type'][1] % targets.length], {
                        visualizePathStyle: { stroke: '#ffffff' },
                    });
                }
            }
        } else {
            let source1 = this.room.find(FIND_DROPPED_RESOURCES)[0];
            if (source1 == null) {
                let source2 = this.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            structure.structureType == STRUCTURE_CONTAINER &&
                            structure.store.energy > 0
                        );
                    },
                });
                if (
                    this.withdraw(
                        source2[Memory['type'][1] % source2.length],
                        RESOURCE_ENERGY
                    ) == ERR_NOT_IN_RANGE
                ) {
                    this.moveTo(source2[Memory['type'][1] % source2.length]);
                }
            } else {
                if (this.pickup(source1) == ERR_NOT_IN_RANGE) {
                    this.moveTo(source1, {
                        visualizePathStyle: { stroke: '#ffaa00' },
                    });
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
