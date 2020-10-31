import { getQuote } from './util';
import { creep } from './base';
import { setReserverAvailableFlag } from 'flag';
export class reserve extends Creep implements creep {
    task: string;
    type: Number = 6;
    work(): void {
        if (this.ticksToLive <= 10 && this.memory['flagName']) {
            setReserverAvailableFlag(this.memory['flagName']);
            this.suicide();
        }
        let source = Game.flags[this.memory.flagName];
        if (source.room) {
            let controller = source.room.controller;
            if (!controller) {
                this.moveTo(source, {
                    visualizePathStyle: { stroke: '#ffaa00' }
                });
            } else {
                const text = getQuote(this.room.controller.id);
                if (!(controller.sign && controller.sign.text == text)) {
                    if (
                        this.signController(controller, text) ==
                        ERR_NOT_IN_RANGE
                    ) {
                        this.moveTo(controller, {
                            visualizePathStyle: { stroke: '#ffaa00' }
                        });
                    }
                }
                if (this.reserveController(controller) == ERR_NOT_IN_RANGE) {
                    this.moveTo(controller, {
                        visualizePathStyle: { stroke: '#ffaa00' }
                    });
                }
            }
        } else {
            this.moveTo(source, {
                visualizePathStyle: { stroke: '#ffaa00' }
            });
        }
        // if (this.ticksToLive <= 50) {
        //     let task = `Reserver ${Game.spawns['Spawn1'].room.energyCapacityAvailable}`;
        //     if (Memory['spawnTask'].includes(task)) {
        //         return;
        //     }
        //     Memory['spawnTask'].unshift(task);
        // }
    }
}
