import { pushCarrierTask } from 'task.manager';
import { assignPrototype } from 'utils';
import { base, structure } from './../base';

export default class containerExt extends StructureContainer implements base {
    work() {
        if (this.store.getUsedCapacity() > 400) {
            for (const res in this.store) {
                if (Object.prototype.hasOwnProperty.call(this.store, res)) {
                    if (this.store[res] > 0)
                        pushCarrierTask(`transfer ${this.id} ${res}`, this.id);
                }
            }
        }
    }
}

export function mountContainer() {
    assignPrototype(StructureContainer, containerExt);
}
