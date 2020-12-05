import { structure } from 'base';
import { assignPrototype, requestEnergy, requestEnergyPos } from 'utils';
export class extensionExt extends StructureExtension implements structure {
    work() {
        if (this.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            requestEnergyPos((this.room.storage)?this.room.storage.id : '', this.id,this.pos);
        }
    }
}
export function mountExtension() {
    assignPrototype(StructureExtension, extensionExt);
}
