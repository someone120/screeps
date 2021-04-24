import { pushCarrierTask } from 'mount/tasks/task.manager';
import { assignPrototype } from 'utils';
import {structure } from 'ScreepsBase';

export default class containerExt extends StructureContainer implements structure {
    work() {
        if (this.store.getUsedCapacity() > 400) {
            for (const res in this.store) {
                if (Object.prototype.hasOwnProperty.call(this.store, res)) {
                    if (this.store[res as ResourceConstant] > 0)
                        pushCarrierTask(`TransferMineral/${this.id}/${res}/${this.room.storage!.id}/${res}`,this.room.name, this.id);
                }
            }
        }
    }
}

export function mountContainer() {
    assignPrototype(StructureContainer, containerExt);
}
