import { creepExt } from 'base';
import _ from 'lodash';
import { pushSpawnTask } from 'mount/tasks/task.manager';
import { getStorageLink } from 'utils';

export class Manager extends Creep implements creepExt {

    type: Number = 8;
    work() {
        let link = getStorageLink(this.room.name);

        if (link && this.room.storage) {
            let pos = this.pos.intersection(
                this.room.storage.pos.getFreeSpace(),
                link.pos.getFreeSpace()
            );
            console.log(pos);

            this.memory.standed = true;
            this.room.addRestrictedPos(this.name, pos[0]);
            if (this.store.getUsedCapacity() > 0) {
                for (const res in this.store) {
                    if (Object.prototype.hasOwnProperty.call(this.store, res)) {
                        if (
                            this.transfer(
                                this.room.storage!,
                                res as ResourceConstant
                            ) == ERR_NOT_IN_RANGE
                        ) {
                            this.goTo(pos[0]);
                        }
                    }
                }
                return;
            }
            if (link && link.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
                if (this.withdraw(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.goTo(pos[0]);
                }
                return;
            }

            if (this.ticksToLive && this.ticksToLive < 500) {

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
                pushSpawnTask(`energyTransfer ${available}`, this.memory.roomID, false);
            }
        }
    }
}
