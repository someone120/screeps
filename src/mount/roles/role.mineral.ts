import { creepExt } from 'base';

export class Mineraler extends creepExt {
    type: Number = 10;
    work(): void {
        super.work()
        if (
            Game.rooms[this.memory.roomID].controller &&
            Game.rooms[this.memory.roomID].controller!.level >= 6
        ) {
            let mineral = this.room.find(FIND_MINERALS);
            const result = this.harvest(mineral[0]);

            if (result == ERR_NOT_IN_RANGE) {
                this.goTo(mineral[0].pos);
            } else if (result == OK) {
                let container = this.pos
                    .lookFor(LOOK_STRUCTURES)
                    .find((it) => it.structureType == STRUCTURE_CONTAINER);
                if (container) {
                    container.work();
                } else {
                    this.pos.createConstructionSite(STRUCTURE_CONTAINER);
                }
            } else if (result == ERR_NOT_ENOUGH_RESOURCES) {
                this.memory.type = 3;
            }
        } else {
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
