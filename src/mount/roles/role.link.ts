import { structure } from 'base';
import { assignPrototype, getStorageLink } from 'utils';
export class extensionLink extends StructureLink implements structure {
    work() {
        if (
            this.store.getFreeCapacity(RESOURCE_ENERGY) == 0 &&
            getStorageLink(this.room.name) &&
            getStorageLink(this.room.name)!.store.getUsedCapacity(
                RESOURCE_ENERGY
            ) == 0
        ) {
            this.transferEnergy(getStorageLink(this.room.name)!);
        }
    }
}
export function mountLink() {
    assignPrototype(StructureLink, extensionLink);
}
