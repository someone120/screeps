import { getQuote } from './util';
import { creep } from './base';
export class reserve extends Creep implements creep {
    task: String;
    type: Number = 6;
    work(): void {
        let source =
            Game.flags[
                Object.keys(Game.flags).find((v) => {
                    return v.split(' ')[0] == 'RemoteSource';
                })
            ];
        if (source.room) {
            let controller = source.room.controller;
            if (!controller) {
                this.moveTo(source, {
                    visualizePathStyle: { stroke: '#ffaa00' }
                });
            } else {
                const text = getQuote(this.room.name);

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
