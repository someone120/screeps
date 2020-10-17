import { structure } from './base';
import { assignPrototype, requestEnergy } from './util';

export class extensionStorage extends StructureStorage implements structure {
    work() {
        if (this.store.getUsedCapacity() < 100_000 && Memory['type'][2] > 5) {
            let task = 'requestEneryge  ' + this.id;
            if (Memory.porterTasker.includes(task)) {
                return;
            }
            let t = Memory.porterTasker.shift();
            if (t.split(' ')[2] != this.id) {
                Memory.porterTasker.unshift(task);
            }
            Memory.porterTasker.unshift(t);
        }
    }
}
export function mountStorage() {
    assignPrototype(StructureStorage, extensionStorage);
}
