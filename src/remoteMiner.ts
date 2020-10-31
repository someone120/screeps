import { setMinerAvailableFlag, setReserverAvailableFlag } from 'flag';
import { creep } from './base';
export class remoteMiner extends Creep implements creep {
    task: string;
    type: Number = 5;
    work(): void {
        let source = Game.flags[this.memory.flagName];
        if (this.ticksToLive <= 10 && this.memory['flagName']) {
            setMinerAvailableFlag(this.memory['flagName']);
            this.suicide();
        }
        let attackCreep = this.room.find(FIND_HOSTILE_CREEPS, {
            filter: (it) => {
                return it.owner.username == 'Invader';
            }
        });
        if (attackCreep) {
            attackCreep.sort((a, b) => {
                return this.pos.getRangeTo(a.pos) - this.pos.getRangeTo(b.pos);
            });
            if (this.pos.getRangeTo(attackCreep[0]) <= 3) {
                this.rangedAttack(attackCreep[0]);
            }
        }
        if (source && this.pos.roomName == source.pos.roomName) {
            if (
                this.harvest(source.pos.lookFor(LOOK_SOURCES)[0]) ==
                ERR_NOT_IN_RANGE
            ) {
                this.moveTo(source);
            }
        } else {
            if (source) this.moveTo(source);
        }
        if (
            !this.pos.lookFor(LOOK_STRUCTURES).find((v) => {
                return v.structureType == STRUCTURE_ROAD;
            }) ||
            !this.pos.lookFor(LOOK_CONSTRUCTION_SITES).find((v) => {
                return v.structureType == STRUCTURE_ROAD;
            })
        ) {
            this.pos.createConstructionSite(STRUCTURE_ROAD);
        }
        if (
            this.pos.isNearTo(source.pos) &&
            (!this.pos.lookFor(LOOK_STRUCTURES).find((it) => {
                return it.structureType == STRUCTURE_CONTAINER;
            }) ||
                !this.pos.lookFor(LOOK_CONSTRUCTION_SITES).find((it) => {
                    return it.structureType == STRUCTURE_CONTAINER;
                }))
        ) {
            this.pos.createConstructionSite(STRUCTURE_CONTAINER);
        }
    }
}
