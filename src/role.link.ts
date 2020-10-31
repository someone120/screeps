import { structure } from 'base';
import { assignPrototype, getStorageLink } from './util';
export class extensionLink extends StructureLink implements structure {
    work() {
        if (
            this.store.getFreeCapacity(RESOURCE_ENERGY) == 0 &&
            getStorageLink().store.getUsedCapacity(RESOURCE_ENERGY) == 0
        ) {
            this.transferEnergy(getStorageLink());
        }
    }
}
export function mountLink() {
    assignPrototype(StructureLink, extensionLink);
}
