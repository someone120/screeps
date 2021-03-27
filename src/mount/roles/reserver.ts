import { getQuote } from 'utils';
import { creepExt } from 'base';
import { getReserverFirstAvailableFlag, setReserverAvailableFlag } from 'flag';
import { pushSpawnTask } from 'mount/tasks/task.manager';
export class reserve extends Creep implements creepExt {
    type: Number = 6;
    work(): void {
        let source = Game.flags[this.memory.flagName!];
        if (!source) {
            setReserverAvailableFlag(this.memory.flagName!);
            let flag = getReserverFirstAvailableFlag();
            this.memory.flagName = flag;
            setReserverAvailableFlag(flag!);
        }
        if (source.room) {
            let controller = source.room.controller;
            if (!controller) {
                this.farMoveTo(source.pos, 1);
            } else {
                const text = getQuote(this.room.controller?.id || 'awa');
                if (!(controller.sign && controller.sign.text == text)) {
                    if (
                        this.signController(controller, text) ==
                        ERR_NOT_IN_RANGE
                    ) {
                        this.farMoveTo(controller.pos, 1);
                    }
                }
                if (
                    this.room.controller!.reservation &&
                    this.room.controller!.reservation.username !=
                    this.owner.username
                ) {
                    if (this.attackController(controller) == ERR_NOT_IN_RANGE) {
                        this.farMoveTo(controller.pos, 1);
                    }
                }
                const result = this.reserveController(controller);
                if (result == ERR_NOT_IN_RANGE) {
                    this.farMoveTo(controller.pos, 1);
                } else if (result == OK) {
                    this.memory.standed = true;
                    this.room.addRestrictedPos(this.name, this.pos);
                }
            }
        } else {
            this.farMoveTo(source.pos, 1);
        }
        if ( (this.ticksToLive|| 1500 )<= 100) {

            let available = Game.rooms[this.memory.roomID].energyCapacityAvailable;
            if (available >= 10000) {
                available = 10000;
            } else if (available >= 5600) {
                available = 5600;
            } else if (available >= 2300) {
                available = 2300;
            } else if (available >= 1800) {
                available = 1800;
            } else if (available >= 1300) {
                available = 1300;
            } else if (available >= 800) {
                available = 800;
            } else if (available >= 550) {
                available = 550;
            } else if (available >= 300) {
                available = 300;
            }
            pushSpawnTask(
                `Reserver ${available} ${this.memory.flagName}`,
                this.memory.roomID
            );
            this.room.removeRestrictedPos(this.name);
        }
    }
}
