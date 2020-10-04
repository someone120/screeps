import { base, creep } from './base';
export class Repairer extends Creep implements creep {
    task: String;
    type: Number = 4;
    work() {
        if (this.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            let source2 = this.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        structure.structureType == STRUCTURE_CONTAINER &&
                        structure.store.energy > 0
                    );
                },
            });
            if (this.withdraw(source2, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(source2, {
                    visualizePathStyle: { stroke: '#ffff99' },
                });
            }
        } else {
            let target = this.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        (structure.hitsMax - structure.hits > 300 &&
                            structure.structureType != STRUCTURE_WALL &&
                            structure.hits < 50000) ||
                        (structure.structureType == STRUCTURE_WALL &&
                            structure.hits < 10000)
                    );
                },
            });
            let res = this.repair(target[0]);
            if (res == ERR_NOT_IN_RANGE) {
                this.moveTo(target[0], {
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
