import { creep } from './base';
import { pushCarrierTask } from './task.manager';
export class remoteMiner extends Creep implements creep {
    task: String;
    type: Number = 5;
    work(): void {
        let source =
            Game.flags[
                Object.keys(Game.flags).find((v) => {
                    return v.split(' ')[0] == 'RemoteSource';
                })
            ];
        if (source && this.pos.roomName == source.pos.roomName) {
            if (
                this.harvest(source.pos.lookFor(LOOK_SOURCES)[0]) ==
                ERR_NOT_IN_RANGE
            ) {
                this.moveTo(source);
            }
            if (
                !this.pos.lookFor(LOOK_STRUCTURES).filter((v) => {
                    return v.structureType == STRUCTURE_ROAD;
                }) &&
                !this.pos.lookFor(LOOK_CONSTRUCTION_SITES).filter((v) => {
                    return v.structureType == STRUCTURE_ROAD;
                })
            ) {
                this.pos.createConstructionSite(STRUCTURE_ROAD);
            }
        } else {
            if (source) this.moveTo(source);
        }

        this.drop(RESOURCE_ENERGY);
    }
}
