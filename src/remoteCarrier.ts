import { creep } from './base';
import { getFlags } from './util';
export class RemoteCarrier extends Creep implements creep {
    task: string;
    type: Number = 7;
    work(): void {
        let flags = getFlags();
        if (this.store.getFreeCapacity() == 0) {
            const targets = Game.rooms[this.memory['roomID']].storage;
            if (targets) {
                const result = this.transfer(targets, RESOURCE_ENERGY);
                if (result == ERR_NOT_IN_RANGE) {
                    this.moveTo(targets);
                }
            }
        } else {
            let source2: StructureContainer[] = [];
            flags.forEach((v) => {
                if (v.room) {
                    source2 = source2.concat(
                        v.room.find(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (
                                    structure.structureType ==
                                        STRUCTURE_CONTAINER &&
                                    structure.store.energy > 0
                                );
                            }
                        }) as StructureContainer[]
                    );
                }
            });
            source2 = source2.concat(
                this.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            structure.structureType == STRUCTURE_CONTAINER &&
                            structure.store.energy > 0
                        );
                    }
                }) as StructureContainer[]
            );
            source2.sort((a, b) => {
                return b.store.energy - a.store.energy;
            });
            if (source2.length > 0) {
                const result = this.withdraw(source2[0], RESOURCE_ENERGY);
                if (result == ERR_NOT_IN_RANGE) {
                    this.moveTo(source2[0]);
                }
                return;
            }
            let source = [];
            flags.forEach((v) => {
                if (v.room) {
                    source = source.concat(v.room.find(FIND_DROPPED_RESOURCES));
                }
            });
            source = source.concat(this.room.find(FIND_DROPPED_RESOURCES));
            source.sort((a, b) => {
                return b.amount - a.amount;
            });
            if (this.pickup(source[0]) == ERR_NOT_IN_RANGE) {
                this.moveTo(source[0], {
                    visualizePathStyle: { stroke: '#ffaa00' }
                });
            }
        }
    }
}
