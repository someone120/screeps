import { creepExt } from 'base';
import _ from 'lodash';
import { getStorageLink } from 'utils';

export class Manager extends Creep implements creepExt {
    task: string;
    type: Number = 8;
    work() {
        let link = getStorageLink(this.room.name);
        const spawn = this.pos.findClosestByRange(FIND_MY_SPAWNS);
        let pos = this.pos.intersection(
            this.room.storage.pos.getFreeSpace(),
            link.pos.getFreeSpace(),
            spawn.pos.getFreeSpace()
        );
        this.memory.standed = true;
        this.room.addRestrictedPos(this.name, this.pos);
        if (this.store.getUsedCapacity() > 0) {
            for (const res in this.store) {
                if (Object.prototype.hasOwnProperty.call(this.store, res)) {
                    if (
                        this.transfer(
                            this.room.storage,
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

        if (this.ticksToLive < 500) {
            spawn.renewCreep(this);
        }
    }
}
