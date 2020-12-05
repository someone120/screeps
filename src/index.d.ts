interface Memory {
    rooms: {
        [roomName: string]: RoomMemory;
    };
    bypassRooms: any;
    freeSpaceCount: any;
    porterTasker: string[];
    spawnTask: { [name: string]: string[] };
    ReserverRemoteSource: string[];
    MinerRemoteSource: string[];
    ScoutRemoteSource: string[];
    lessWallId: { [roomName: string]: { id: Id<StructureWall>; ttl: number } };
    type: { [name: string]: number[] };
    beScoutRoom: string[];
}

interface posExt {
    x: number;
    y: number;
    name: string;
}

interface Room {
    addRestrictedPos(creepName: string, pos: RoomPosition): void;
    removeRestrictedPos(creepName: string): void;
    unserializePos(arg0: any);
    getRestrictedPos();
    serializePos(pos: RoomPosition);
    sources: Source[];
}

interface Structure {
    work(): void;
}

interface CreepMemory {
    parentTaskRaw?: string;
    protectRoomId?: string;
    type: number;
    remoteSource?: boolean;
    pos?: any;
    roomID: string;
    standed?: boolean;
    _move?: any;
    disableCross?: any;
    prePos?: string;
    farMove?: any;
    flagName?: string;
    index?: number;
    task?: {
        type: string;
        p: string[];
    };
    parentTask?: string;
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
    [energyLevel in
        | 300
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
    requireCross(direction: DirectionConstant): Boolean;
}

interface PowerCreep {
    requireCross(direction: DirectionConstant): Boolean;
}

declare module NodeJS {
    // 全局对象
    interface Global {
        spawnTask: { [spawnName: string]: string };
        porterTasksTaken: String[];
        // 是否已经挂载拓展
        hasExtension: boolean;
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