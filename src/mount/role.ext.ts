import { structure } from 'base';
import { assignPrototype, requestEnergy, requestEnergyPos } from 'utils';
export class extensionExt extends StructureExtension implements structure {
    work() {
        if (this.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            requestEnergy((this.room.storage)?this.room.storage.id : '', this.id);
        }
    }
}
export function mountExtension() {
    assignPrototype(StructureExtension, extensionExt);
}
