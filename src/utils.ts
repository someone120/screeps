
import { pushCarrierTask } from './mount/tasks/task.manager';

const quote: string[] = [
    '隐患险于明火，防范胜于救灾，责任重于泰山。',
    '就在前一个时期，从国外的一些宣传报道，有若干是跟我们的事实真相不相符合的。我想这个丝毫不能去影响我们对于香港问题的解决方针——就是我们的一国可以两制。',
    '那么因此，我曾经给香港的一些先生们讲过一句俗语叫：井水不犯河水。这个我认为是一种很恰当地可以表达我们一个国家两种制度是不变的方针。',
    '但是我想也无可讳言，确实国际上有些人想要把香港成为一个颠覆我们社会主义国家，来攻击我们共产党的领导的这样一个基地。',
    '所以后来我就念了两首诗，叫“苟利国家生死以，岂因祸福避趋之”，那麼所以我就到了北京。',
    '这个 engineering drawing 呢，我们就有几年用鸭嘴的笔，旁边一个小盒子。最痛苦的，就是鸭嘴笔把这个水弄到里面，描图的时候一下子就⋯然后就用刀片刮，这个就是描图是最痛苦的，而且这个效率',
    '我想这个问题发生了以后，我曾经在国内的时候发表过一个简短的讲话。之后我到拉丁美洲来进行访问之前没有发表过一个讲话。',
    '你们真的……我认为……遍地……你们有一个好，全世界跑到什么地方，你们比其他的西方记者啊跑得还快。但是呢问来问去的问题啊，都 too simple，啊，sometimes naive！懂了没啊？',
    '聪明的小滑头，不要试图去打破第四面墙。',
    '打开天窗说亮话吧。'
];

export function getBodyConfig(
    ...bodySets: [
        BodySet,
        BodySet,
        BodySet,
        BodySet,
        BodySet,
        BodySet,
        BodySet,
        BodySet
    ]
): BodyConfig {
    let config = {
        300: [],
        550: [],
        800: [],
        1300: [],
        1800: [],
        2300: [],
        5600: [],
        10000: []
    };
    // 遍历空配置项，用传入的 bodySet 依次生成配置项
    Object.keys(config).map((level, index) => {
        //@ts-ignore
        config[level] = calcBodyPart(bodySets[index]);
    });

    return config;
}

export function calcBodyPart(bodySet: BodySet): BodyPartConstant[] {
    // 把身体配置项拓展成如下形式的二维数组
    // [ [ TOUGH ], [ WORK, WORK ], [ MOVE, MOVE, MOVE ] ]
    const bodys = Object.keys(bodySet).map((type) =>
        //@ts-ignore
        Array(bodySet[type]).fill(type)
    );
    // 把二维数组展平
    //@ts-ignore
    return [].concat(...bodys);
}
export function getOppositeDirection(
    direction: DirectionConstant
): DirectionConstant {
    return <DirectionConstant>(((direction + 3) % 8) + 1);
}
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

export function stateScanner() {
    // 每 20 tick 运行一次
    if (Game.time % 10) return;

    if (!Memory.stats) Memory.stats = {};

    // 统计 GCL / GPL 的升级百分比和等级
    Memory.stats.gcl = (Game.gcl.progress / Game.gcl.progressTotal) * 100;
    Memory.stats.gclLevel = Game.gcl.level;
    Memory.stats.gpl = (Game.gpl.progress / Game.gpl.progressTotal) * 100;
    Memory.stats.gplLevel = Game.gpl.level;
    // CPU 的当前使用量
    Memory.stats.cpu = Game.cpu.getUsed();
    // bucket 当前剩余量
    Memory.stats.bucket = Game.cpu.bucket;
}

export function requestEnergy(
    structureId: string,
    roomName: string,
    isTop: boolean = false
) {
    pushCarrierTask(
        `request/${structureId}/${RESOURCE_ENERGY}`,
        roomName,
        structureId,
        isTop
    );
    // console.log(`requestEneryge ${storageId} ${structureId}`);
}
/**
 * 检测是不是Container
 * @param target 目标
 */
export function isContainer(target: any): target is StructureContainer {
    return target.structureType && target.structureType == STRUCTURE_CONTAINER;
}
/**
 * 检测是不是Storage
 * @param target 目标
 */
export function isStorage(target: any): target is StructureStorage {
    return target.structureType && target.structureType == STRUCTURE_STORAGE;
}
export function buildRoad(from: RoomPosition, to: RoomPosition) {
    let path = PathFinder.search(
        from,
        { pos: to, range: 1 },
        {
            //@ts-ignore
            roomCallback: (roomName) => {
                let room = Game.rooms[roomName];
                if (!room) return;

                let costs = new PathFinder.CostMatrix();

                room.find(FIND_STRUCTURES).forEach(function(struct) {
                    if (struct.structureType === STRUCTURE_ROAD) {
                        // 相对于平原，寻路时将更倾向于道路
                        costs.set(struct.pos.x, struct.pos.y, 1);
                    } else if (
                        struct.structureType !== STRUCTURE_CONTAINER &&
                        (struct.structureType !== STRUCTURE_RAMPART ||
                            !struct.my)
                    ) {
                        // 不能穿过无法行走的建筑
                        costs.set(struct.pos.x, struct.pos.y, 0xff);
                    }
                });

                room.find(FIND_CONSTRUCTION_SITES).forEach(function(struct) {
                    if (struct.structureType === STRUCTURE_ROAD) {
                        // 相对于平原，寻路时将更倾向于道路
                        costs.set(struct.pos.x, struct.pos.y, 1);
                    } else if (
                        struct.structureType !== STRUCTURE_CONTAINER &&
                        (struct.structureType !== STRUCTURE_RAMPART ||
                            !struct.my)
                    ) {
                        // 不能穿过无法行走的建筑
                        costs.set(struct.pos.x, struct.pos.y, 0xff);
                    }
                });
                return costs;
            }
        }
    );
    for (const i in path.path) {
        if (Object.prototype.hasOwnProperty.call(path.path, i)) {
            const element = path.path[i];
            element.createConstructionSite(STRUCTURE_ROAD);
        }
    }
}


export function getSourceFlags(): Flag[] {
    let result = [];
    if (global.RemoteFlag && global.RemoteFlag.ttl < Game.time) {
        global.RemoteFlag.name.forEach((v) => {
            result.push(Game.flags[v]);
        });
    } else {
        global.RemoteFlag = { name: [], ttl: Game.time + 500 };
        for (const key in Game.flags) {
            if (Object.prototype.hasOwnProperty.call(Game.flags, key)) {
                const element = Game.flags[key];
                if (element.name.split('_')[0] == 'RemoteSource') {

                    global.RemoteFlag.name.push(key);
                    result.push(element);
                    
                }
            }
        }
    }
    return result;
}
export function cleanCache() {
    global.RemoteFlag = undefined;
}

export function getQuote(RoomName: string): string {
    let i = 0;
    RoomName.split('').forEach((it) => {
        i += it.charCodeAt(0) ^ 114514;
    });
    return quote[i % quote.length];
}

export function getSourceLink(
    RoomName: string,
    pos: RoomPosition
): StructureLink {
    return pos.findInRange(FIND_STRUCTURES, 1, {
        filter: (it) => {
            return it.structureType == STRUCTURE_LINK;
        }
    })[0] as StructureLink;
}
export function getStorageLink(RoomName: string): StructureLink | null|undefined {
    return Game.rooms[RoomName].storage?.pos.findInRange(FIND_STRUCTURES, 2, {
              filter: (it) => {
                  return it.structureType == STRUCTURE_LINK;
              }
          })[0] as StructureLink;
}

export function argCpu(
    arg: { argCpu: number; ticks: number },
    nowCpu: number
): { argCpu: number; ticks: number } {
    return arg.ticks > 1000
        ? { argCpu: nowCpu, ticks: 1 }
        : {
              argCpu: (arg.argCpu * arg.ticks + nowCpu) / (arg.ticks + 1),
              ticks: arg.ticks + 1
          };
}
