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
                let drop = this.room.find(FIND_DROPPED_RESOURCES);
                if (this.pickup(drop[0]) == ERR_NOT_IN_RANGE) {
                    this.moveTo(drop[0]);
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
