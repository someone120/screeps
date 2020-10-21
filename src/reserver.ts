import { creep } from './base';
import { pushSpawnTask } from './task.manager';
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
                    visualizePathStyle: { stroke: '#ffaa00' },
                });
            } else if (this.reserveController(controller) == ERR_NOT_IN_RANGE) {
                this.moveTo(controller, {
                    visualizePathStyle: { stroke: '#ffaa00' },
                });
            }
        } else {
            this.moveTo(source, {
                visualizePathStyle: { stroke: '#ffaa00' },
            });
        }
        // if (this.ticksToLive <= 50) {
        //     let task = `Reserver Spawn1 ${Game.spawns['Spawn1'].room.energyCapacityAvailable}`;
        //     if (Memory['spawnTask'].includes(task)) {
        //         return;
        //     }
        //     Memory['spawnTask'].unshift(task);
        // }
    }
}
