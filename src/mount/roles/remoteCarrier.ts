//@ts-nocheck
import { creepExt } from 'ScreepsBase';
import { getSourceFlags } from 'utils';
export class RemoteCarrier extends creepExt {
    type: Number = 7;
    work(): void {
        super.work();
        let flags = getSourceFlags();
        if (this.memory.farMove?.path?.length * 2.5 > this.ticksToLive) {
            const spawn = Game.rooms[this.memory.roomID].find(
                FIND_MY_SPAWNS
            )[0];
            this.goTo(spawn);
            spawn.renewCreep(this);
        }
        if (this.store.getFreeCapacity() == 0) {
            const targets = Game.rooms[this.memory['roomID']].storage;
            if (targets) {
                const result = this.transfer(targets, RESOURCE_ENERGY);
                if (result == ERR_NOT_IN_RANGE) {
                    this.farMoveTo(targets.pos);
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
                    this.farMoveTo(source2[0].pos);
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
                    this.farMoveTo(source[0].pos);
                    return;
                }
            }
        }
    }
}
