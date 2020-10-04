import { creep } from './base';
export class Upgrader extends Creep implements creep {
    task: String;
    type: Number = 3;
    work() {
        if (this.memory['building'] && this.store[RESOURCE_ENERGY] == 0) {
            this.memory['building'] = false;
            this.say('🔄 harvest');
        }
        if (!this.memory['building'] && this.store.getFreeCapacity() == 0) {
            this.memory['building'] = true;
            this.say('🚧 build');
        }
        if (this.memory['building']) {
            let targets = this.room.controller;
            if (this.upgradeController(targets) == ERR_NOT_IN_RANGE) {
                this.moveTo(targets, {
                    visualizePathStyle: { stroke: '#ffffff' },
                });
            }
        } else {
            let source2 = this.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        structure.structureType == STRUCTURE_CONTAINER &&
                        structure.store.energy > 0
                    );
                },
            });
            if (!source2[0]) {
                let s = this.room.find(FIND_DROPPED_RESOURCES);
                if (
                    this.pickup(s[Memory['type'][3] % s.length]) ==
                    ERR_NOT_IN_RANGE
                ) {
                    this.moveTo(s[Memory['type'][3] % s.length]);
                }
            } else if (
                this.withdraw(
                    source2[Memory['type'][3] % source2.length],
                    RESOURCE_ENERGY
                ) == ERR_NOT_IN_RANGE
            ) {
                this.moveTo(source2[Memory['type'][3] % source2.length]);
            }
        }
    }
}
