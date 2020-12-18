import _ from 'lodash';

export function filter(it: Creep): boolean {
    return include(it.owner.username);
}

export function include(name: string): boolean {
    if (!Memory.WHITE_LIST) {
        Memory.WHITE_LIST = [];
        return false;
    }
    return Memory.WHITE_LIST.includes(name);
}

export function add(name: string): boolean {
    if (!Memory.WHITE_LIST) {
        Memory.WHITE_LIST = [name];
        return true;
    }
    if (Memory.WHITE_LIST.includes(name)) {
        return false;
    }
    Memory.WHITE_LIST.push(name);
    return true;
}
export function remove(name: string): boolean {
    _.pull(Memory.WHITE_LIST, name);
    return true;
}
