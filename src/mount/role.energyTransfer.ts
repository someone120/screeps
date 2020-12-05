import { creepExt } from 'base';
import { getStorageLink } from 'utils';
export class Manager extends Creep implements creepExt {
    task: string;
    type: Number = 8;
    work() {
        if (this.store.getUsedCapacity() > 0) {
            for (const res in this.store) {
                if (Object.prototype.hasOwnProperty.call(this.store, res)) {
                    if (
                        this.transfer(
                            this.room.storage,
                            res as ResourceConstant
                        ) == ERR_NOT_IN_RANGE
                    ) {
                        this.goTo(this.room.storage.pos);
                    }
                }
            }
            return;
        }
        let link = getStorageLink();
        if (link.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
            if (this.withdraw(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.goTo(link.pos);
            }
            return;
        }
        if (
            this.room.terminal &&
            this.room.terminal.store.getUsedCapacity() > 0
        ) {
            for (const res in this.room.terminal.store) {
                if (
                    Object.prototype.hasOwnProperty.call(
                        this.room.terminal.store,
                        res
                    )
                ) {
                    if (
                        this.withdraw(
                            this.room.terminal,
                            res as ResourceConstant
                        ) == ERR_NOT_IN_RANGE
                    ) {
                        this.goTo(this.room.terminal.pos);
                    }
                }
            }
            return;
        }
    }
}
