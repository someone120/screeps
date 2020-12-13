import { creepExt } from 'base';
import { getSourceFlags } from 'utils';
export class RemoteCarrier extends Creep implements creepExt {
    task: string;
    type: Number = 7;
    work(): void {
        let flags = getSourceFlags();
        if (this.store.getFreeCapacity() == 0) {
            const targets = Game.rooms[this.memory['roomID']].storage;
            if (targets) {
                const result = this.transfer(targets, RESOURCE_ENERGY);
                if (result == ERR_NOT_IN_RANGE) {
                    this.goTo(targets.pos);
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
            if (source2.length > 0) {
                source2.sort((a, b) => {
                    return b.store.energy - a.store.energy;
                });
                // console.log(source2[0].id);
                
                const result = this.withdraw(source2[0], RESOURCE_ENERGY);
                if (result == ERR_NOT_IN_RANGE) {
                    this.goTo(source2[0].pos);
                    return;
                }
            }
            let source = [];
            flags.forEach((v) => {
                if (v.room) {
                    source = source.concat(v.room.find(FIND_DROPPED_RESOURCES));
                }
            });
            if (source.length > 0) {
                source.sort((a, b) => {
                    return b.amount - a.amount;
                });
                if (this.pickup(source[0]) == ERR_NOT_IN_RANGE) {
                    this.goTo(source[0].pos);
                    return;
                }
            }
        }
    }
}
