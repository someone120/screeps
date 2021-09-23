interface Memory {
    stats: any;
    rooms: {
        [roomName: string]: RoomMemory;
    };
    destoryNext?: string;
    bypassRooms: string[];
    lockSource: string[];
    towerStat: { [room: string]: string };
    freeSpaceCount: any;
    porterTasker: { [name: string]: string[] };
    spawnTask: { [name: string]: string[] };
    ReserverRemoteSource: string[];
    MinerRemoteSource: string[];
    ScoutRemoteSource: string[];
    lessWallId?: { [roomName: string]: { id: Id<StructureWall>; ttl: number } };
    type: { [name: string]: number[] };
    beScoutRoom: string[];
    argCpu: { argCpu: number, ticks: number }
    WHITE_LIST: string[];
}
type Colors = 'green' | 'blue' | 'yellow' | 'red'| undefined
interface RoomPosition {
    isOnEdge(i?: number): boolean

    directionToPos(
        direction: DirectionConstant
    ): RoomPosition | undefined

    getFreeSpace(): RoomPosition[]

    intersection(...p: RoomPosition[][]): RoomPosition[]

    serializePos(): string

}

interface posExt {
    x: number;
    y: number;
    name: string;
}

interface Room {
    mineral: Mineral;

    findUnlockSource(id: Id<Source>[]): Id<Source> | undefined;

    unlockSource(id: Id<Source>): void;

    lockSource(id: Id<Source>): void;

    addRestrictedPos(creepName: string, pos: RoomPosition): void;

    removeRestrictedPos(creepName: string): void;

    unserializePos(posStr: string): RoomPosition | undefined;

    getRestrictedPos(): { [creepName: string]: string };

    serializePos(pos: RoomPosition): string;

    sources: Source[];
}

interface RoomMemory {
    isLockByProtect?: boolean;
    center?: [number, number]
    restrictedPos?: { [CreepName: string]: string }
    CarrierTask?:string[]
    hasHostile?:boolean
}

interface Structure {
    store: any;

    work(): void;
}

interface CreepMemory {
    spentTime?:number;
    parentTaskRaw?: string;
    sourceID?: string;
    building?: boolean
    protectRoomId?: string;
    type: number;
    remoteSource?: boolean;
    pos?: any;
    roomID: string;
    standed?: boolean;
    isSend?: boolean;
    _move?: any;
    disableCross?: any;
    prePos?: string;
    farMove?: {
        // 序列化之后的路径信息
        path?: string | null;
        // 移动索引，标志 creep 现在走到的第几个位置
        index?: number;
        // 上一个位置信息，形如"14/4"，用于在 creep.move 返回 OK 时检查有没有撞墙
        prePos?: string;
        // 缓存路径的目标，该目标发生变化时刷新路径, 形如"14/4E14S1"
        targetPos?: string;
    };
    flagName?: string;
    index?: number;
    task?: {
        type: string;
        p: string[];
    };
    parentTask?: string;
    haveMove?: boolean;
}

type BodyAutoConfigConstant =
    | 'harvester'
    | 'worker'
    | 'upgrader'
    | 'manager'
    | 'processor'
    | 'reserver'
    | 'attacker'
    | 'healer'
    | 'dismantler'
    | 'remoteHarvester';

type BodyConfigs = {
    [type in BodyAutoConfigConstant]: BodyConfig;
};

type BodyConfig = {
    [energyLevel in | 300
        | 550
        | 800
        | 1300
        | 1800
        | 2300
        | 5600
        | 10000]: BodyPartConstant[];
};

interface BodySet {
    [MOVE]?: number;
    [CARRY]?: number;
    [ATTACK]?: number;
    [RANGED_ATTACK]?: number;
    [WORK]?: number;
    [CLAIM]?: number;
    [TOUGH]?: number;
    [HEAL]?: number;
}

interface Creep {
    _move: any;

    goTo(
        target: RoomPosition,
        opts?: MoveToOpts
    ): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND

    requireCross(direction: DirectionConstant): Boolean;

    farMoveTo(
        target: RoomPosition,
        range?: number
    ):
        | CreepMoveReturnCode
        | ERR_NO_PATH
        | ERR_NOT_IN_RANGE
        | ERR_INVALID_TARGET

    findPath(target: RoomPosition, range: number): string | null

    serializeFarPath(positions: RoomPosition[]): string

    goByCache():
        | CreepMoveReturnCode
        | ERR_NO_PATH
        | ERR_NOT_IN_RANGE
        | ERR_INVALID_TARGET

    move(
        target: DirectionConstant | Creep
    ): CreepMoveReturnCode | ERR_INVALID_TARGET | ERR_NOT_IN_RANGE

    mutualCross(
        direction: DirectionConstant
    ): OK | ERR_BUSY | ERR_NOT_FOUND

    directionToPos(
        pos: RoomPosition,
        direction: DirectionConstant
    ): RoomPosition | undefined
}

interface PowerCreep {
    requireCross(direction: DirectionConstant): Boolean;
}

interface Source {
    _freeSpaceCount: number
}

declare module NodeJS {
    // 全局对象
    interface Global {
        RemoteFlag?: { name: string[], ttl: number };
        spawnTask?: { [spawnName: string]: string | undefined };
        porterTasksTaken: String[];
        // 是否已经挂载拓展
        hasExtension: boolean;
        TowerTarget: { [RoomName: string]: Id<Creep> };
        // 全局的路径缓存
        // Creep 在执行远程寻路时会优先检查该缓存
        routeCache: {
            // 键为路径的起点和终点名，例如："12/32/W1N1 23/12/W2N2"，值是使用 Creep.serializeFarPath 序列化后的路径
            [routeKey: string]: string;
        };
        // 全局缓存的订单价格表
        resourcePrice: {
            // 键为资源和订单类型，如："energy/buy"、"power/sell"，值是缓存下来的订单价格
            [resourceKey: string]: number;
        };
    }
}

interface SpawnMemory {
    time?: number
}