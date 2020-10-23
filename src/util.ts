import { pushCarrierTask } from './task.manager';

const quote: string[] = [
    '隐患险于明火，防范胜于救灾，责任重于泰山。',
    '就在前一个时期，从国外的一些宣传报道，有若干是跟我们的事实真相不相符合的。我想这个丝毫不能去影响我们对于香港问题的解决方针——就是我们的一国可以两制。',
    '那么因此，我曾经给香港的一些先生们讲过一句俗语叫：井水不犯河水。这个我认为是一种很恰当地可以表达我们一个国家两种制度是不变的方针。',
    '但是我想也无可讳言，确实国际上有些人想要把香港成为一个颠覆我们社会主义国家，来攻击我们共产党的领导的这样一个基地。',
    '所以后来我就念了两首诗，叫“苟利国家生死以，岂因祸福避趋之”，那麼所以我就到了北京。',
    '这个 engineering drawing 呢，我们就有几年用鸭嘴的笔，旁边一个小盒子。最痛苦的，就是鸭嘴笔把这个水弄到里面，描图的时候一下子就⋯然后就用刀片刮，这个就是描图是最痛苦的，而且这个效率 efficiency⋯'
];
export const assignPrototype = function(
    obj1: { [key: string]: any },
    obj2: { [key: string]: any }
) {
    Object.getOwnPropertyNames(obj2.prototype).forEach((key) => {
        if (key.includes('Getter')) {
            Object.defineProperty(obj1.prototype, key.split('Getter')[0], {
                get: obj2.prototype[key],
                enumerable: false,
                configurable: true
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

export function getQuote(RoomName: String): string {
    let index = 0;
    RoomName.split('').forEach((it) => {
        index = index ^ it.charCodeAt(0);
    });
    return quote[index % quote.length];
}
