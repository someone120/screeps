import { creepExt } from 'ScreepsBase';

export class Mineraler extends creepExt {
    type: Number = 10;
    work(): void {
        super.work();
        if (
            Game.rooms[this.memory.roomID].controller &&
            Game.rooms[this.memory.roomID].controller!.level >= 6
        ) {
            let mineral = this.room.find(FIND_MINERALS);
            let result:
                | CreepActionReturnCode
                | ERR_NOT_FOUND
                | ERR_NOT_ENOUGH_RESOURCES = 0;
            if (!this.pos.isNearTo(mineral[0])) {
                this.goTo(mineral[0].pos);
            }
            let container = this.pos
                .lookFor(LOOK_STRUCTURES)
                .find(
                    (it) => it.structureType == STRUCTURE_CONTAINER
                ) as StructureContainer;
            if (container) {
                container.work();
                if (container.store.getFreeCapacity() > 0)
                    result = this.harvest(mineral[0]);
            } else {
                this.pos.createConstructionSite(STRUCTURE_CONTAINER);
            }
            if (result == ERR_NOT_ENOUGH_RESOURCES) {
                this.memory.type = 3;
            }
            if (this.store.getUsedCapacity() > 0) {
                for (const res in this.store) {
                    if (Object.prototype.hasOwnProperty.call(this.store, res)) {
                        this.drop(res as ResourceConstant);
                    }
                }
            }
        }
    }
}
