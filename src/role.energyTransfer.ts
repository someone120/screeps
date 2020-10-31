import { creep } from 'base';
import { getStorageLink } from './util';
export class energyTransfer extends Creep implements creep {
    task: string;
    type: Number = 8;
    work() {
        if (!this.pos.isEqualTo(new RoomPosition(25,22,this.memory['roomID']))) {
            this.moveTo(new RoomPosition(25,22,this.memory['roomID']));
            return;
        }
        if (this.store.getUsedCapacity() > 0) {
            this.transfer(this.room.storage, RESOURCE_ENERGY);
            return;
        }
        let link = getStorageLink();
        if (link.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
            this.withdraw(link, RESOURCE_ENERGY);
            return;
        }
    }
}
