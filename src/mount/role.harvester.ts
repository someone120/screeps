import { creepExt } from 'base';
import { getSourceLink } from 'utils';
// import { getSourceLink } from 'utils';
import { freeSpaceCount } from './cache/room/source';
//获取energy
export class harvester extends Creep implements creepExt {
    task: string;
    type: Number = 0;
    work() {
        const target = this.room.sources[0];
        const mine = this.harvest(target);
        if (mine == ERR_NOT_IN_RANGE) {
            this.goTo(target.pos,{range:1});
        } else if (mine == OK) {
            this.memory.standed = true;
            this.room.addRestrictedPos(this.name, this.pos);
            if (this.room.controller.level >= 5) {
                if (
                    getSourceLink().store.getFreeCapacity(RESOURCE_ENERGY) > 0
                ) {
                    this.transfer(getSourceLink(), RESOURCE_ENERGY);
                }
                const container = this.pos
                    .lookFor(LOOK_STRUCTURES)
                    .find((it) => {
                        return it.structureType == STRUCTURE_CONTAINER;
                    });
                if (container) {
                    container.destroy();
                }
            } else {
                const container = this.pos
                    .lookFor(LOOK_STRUCTURES)
                    .find((it) => {
                        return it.structureType == STRUCTURE_CONTAINER;
                    });
                if (!container) {
                    this.pos.createConstructionSite(STRUCTURE_CONTAINER);
                }
            }
        }
        if (this.ticksToLive < 10) {
            this.room.removeRestrictedPos(this.name);
        }
        if (this.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            this.drop(RESOURCE_ENERGY);
        }
    }
}
