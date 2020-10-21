import { structure } from './base';
import { assignPrototype, requestEnergy } from './util';

export class extensionStorage extends StructureStorage implements structure {
    work() {
        if (this.store.getUsedCapacity() < 100_000) {
            requestEnergy('',this.id)
        }
    }
}
export function mountStorage() {
    assignPrototype(StructureStorage, extensionStorage);
}
