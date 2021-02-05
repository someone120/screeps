import { creepExt } from 'base';
import _ from 'lodash';
import { getStorageLink } from 'utils';

export class Manager extends Creep implements creepExt {

    type: Number = 8;
    work() {
        let link = getStorageLink(this.room.name);
        const spawn = this.pos.findClosestByRange(FIND_MY_SPAWNS)!;
        if (
            spawn.store[RESOURCE_ENERGY] < 300 &&
            this.store.getUsedCapacity(RESOURCE_ENERGY) !== 0
        ) {
            let result = this.transfer(spawn, RESOURCE_ENERGY);
            if (result == OK) return;
        }
        if (
            spawn.store[RESOURCE_ENERGY] < 300 &&
            this.store.getUsedCapacity(RESOURCE_ENERGY) === 0
        ) {
            let result = this.withdraw(this.room.storage!, RESOURCE_ENERGY);
            if (result == OK) return;
        }
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
                spawn.renewCreep(this);
            }
        }
    }
}
