import { structure } from 'base';
import { assignPrototype, requestEnergy } from 'utils';
export class extensionExt extends StructureExtension implements structure {
    work() {
        if (this.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            requestEnergy( this.id,this.room.name);
        }
    }
}
export function mountExtension() {
    assignPrototype(StructureExtension, extensionExt);
}
