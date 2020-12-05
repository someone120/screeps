import { creepExt } from 'base';

export class Mineraler extends Creep implements creepExt {
    task: string;
    type: Number = 10;
    work(): void {
        if (
            Game.rooms[this.memory.roomID].controller &&
            Game.rooms[this.memory.roomID].controller.level >= 6
        ) {
            let mineral = this.room.find(FIND_MINERALS);
            if (this.harvest(mineral[0]) == ERR_NOT_IN_RANGE) {
                this.goTo(mineral[0].pos);
            } else {
                let container = this.pos
                    .lookFor(LOOK_STRUCTURES)
                    .find((it) => it.structureType == STRUCTURE_CONTAINER);
                if (container) {
                    container.work();
                } else {
                    this.pos.createConstructionSite(STRUCTURE_CONTAINER);
                }
            }
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
