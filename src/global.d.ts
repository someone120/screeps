
declare module NodeJS {
    interface Global {
        Game: Game;
        Memory: Memory;
        _: _.LoDashStatic;
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
