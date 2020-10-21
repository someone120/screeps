import { pushCarrierTask } from './task.manager';

export const assignPrototype = function(
    obj1: { [key: string]: any },
    obj2: { [key: string]: any }
) {
    Object.getOwnPropertyNames(obj2.prototype).forEach((key) => {
        if (key.includes('Getter')) {
            Object.defineProperty(obj1.prototype, key.split('Getter')[0], {
                get: obj2.prototype[key],
                enumerable: false,
                configurable: true,
            });
        } else obj1.prototype[key] = obj2.prototype[key];
    });
};

export function checkQuantity(creeps: { [creepName: string]: Creep }) {
    if (Game.time % 10 != 0) {
        return;
    }
    Memory['type'] = [0, 0, 0, 0, 0, 0, 0, 0];
    Object.values(creeps).forEach((creep) => {
        Memory['type'][creep.memory['type']]++;
    });
}
export function stateScanner() {
    // 每 20 tick 运行一次
    if (Game.time % 10) return;

    if (!Memory['stats']) Memory['stats'] = {};

    // 统计 GCL / GPL 的升级百分比和等级
    Memory['stats'].gcl = (Game.gcl.progress / Game.gcl.progressTotal) * 100;
    Memory['stats'].gclLevel = Game.gcl.level;
    Memory['stats'].gpl = (Game.gpl.progress / Game.gpl.progressTotal) * 100;
    Memory['stats'].gplLevel = Game.gpl.level;
    // CPU 的当前使用量
    Memory['stats'].cpu = Game.cpu.getUsed();
    // bucket 当前剩余量
    Memory['stats'].bucket = Game.cpu.bucket;
}

export function requestEnergyPos(
    storageId: String,
    structureId: String,
    pos: RoomPosition
) {
    pushCarrierTask(
        `requestEneryge ${storageId} ${structureId} ${pos.x} ${pos.y}`,
        structureId
    );
    // console.log(`requestEneryge ${storageId} ${structureId}`);
}
export function requestEnergy(storageId: String, structureId: String) {
    pushCarrierTask(`requestEneryge ${storageId} ${structureId}`, structureId);
    // console.log(`requestEneryge ${storageId} ${structureId}`);
}

export function buildRoad(from: RoomPosition, to: RoomPosition) {
    let path = PathFinder.search(from, { pos: to, range: 1 });
    for (let i of path.path) {
        i.createConstructionSite(STRUCTURE_ROAD);
    }
}

export function encode(text: String): String {
    return require('bs58')
        .encode(text.split(''))
        .toString();
}

export function decode(text: String): String {
    return require('bs58')
        .decode(text)
        .toString();
}
export function getFlags(): Flag[] {
    let result = [];
    if (global['RemoteFlag']) {
        global['RemoteFlag'].forEach((v) => {
            result.push(Game.flags[v]);
        });
    } else {
        global['RemoteFlag'] = [];
        for (const key in Game.flags) {
            if (Object.prototype.hasOwnProperty.call(Game.flags, key)) {
                const element = Game.flags[key];
                if (element.name.split(' ')[0] == 'RemoteSource') {
                    global['RemoteFlag'].push(key);
                    result.push(element);
                }
            }
        }
    }
    return result;
}
export function cleanCache() {
    global['RemoteFlag'] = undefined;
}
