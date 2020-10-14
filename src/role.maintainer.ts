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
                let drop = this.room.find(FIND_DROPPED_RESOURCES);
                if (this.pickup(drop[0]) == ERR_NOT_IN_RANGE) {
                    this.moveTo(drop[0]);
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
