import { getQuote } from './util';
import { creep } from './base';
export class Upgrader extends Creep implements creep {
    task: string;
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
            const text = getQuote(this.room.controller.id);
            if (!(targets.sign && targets.sign.text == text)) {
                if (this.signController(targets, text) == ERR_NOT_IN_RANGE) {
                    this.moveTo(targets, {
                        visualizePathStyle: { stroke: '#ffaa00' }
                    });
                }
            }
            if (this.upgradeController(targets) == ERR_NOT_IN_RANGE) {
                this.moveTo(targets, {
                    visualizePathStyle: { stroke: '#ffffff' }
                });
            }
        } else {
            let source2 = this.room.storage;
            if (!source2) {
                const source2 = this.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            structure.structureType == STRUCTURE_CONTAINER &&
                            structure.store.energy > 0
                        );
                    }
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
                            visualizePathStyle: { stroke: '#ffaa00' }
                        });
                    }
                }
            } else if (
                this.withdraw(source2, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
            ) {
                this.moveTo(source2);
            }
        }
    }
}
