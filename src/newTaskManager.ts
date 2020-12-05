const tasks: {
    [TaskName: string]: { task: ((creep) => boolean)[]; paramLenget: number };
} = {
    TransferMineral: { task: [transfer, transfer], paramLenget: 4 },
    request: { task: [supply], paramLenget: 2 }
};

/** 转移资源
 * 需要两个参数，p[0]为目标，p[1]为需要的资源。
 */
export function transfer(creep: Creep): boolean {
    if (!creep.memory.task || creep.memory.task.type != 'transfer') {
        creep.memory.task = null;
        return true;
    }
    let obj = Game.getObjectById<StructureStorage>(creep.memory.task.p[0]);
    if (!obj || !obj.store) {
        return true;
    }
    if (
        creep.transfer(obj, creep.memory.task.p[1] as ResourceConstant) !=
        ERR_NOT_IN_RANGE
    ) {
        return true;
    }
    creep.goTo(obj.pos);
    return false;
}

export function prepare(creep: Creep): boolean {
    let task = creep.memory.parentTaskRaw.split('/');

    creep.memory.parentTask = task.shift();
    creep.memory.task.p = task;

    return true;
}

/** 供应资源
 * 需要两个参数，p[0]为目标，p[1]为需要的资源。
 * 在没有所需要的资源会自动向storage拿
 */
export function supply(creep: Creep): boolean {
    if (creep.store[creep.memory.task.p[1]] <= 0) {
        if (
            creep.transfer(
                creep.room.storage,
                creep.memory.task.p[1] as ResourceConstant
            ) == ERR_NOT_IN_RANGE
        ) {
            creep.goTo(creep.room.storage.pos);
        }
        return false;
    }
    if (
        creep.transfer(
            Game.getObjectById(creep.memory.task.p[0]),
            creep.memory.task.p[1] as ResourceConstant
        ) == ERR_NOT_IN_RANGE
    ) {
        creep.goTo(creep.room.storage.pos);
        return false;
    }
}

export function doing(creep: Creep) {
    //如果没有任务就结束
    if (!creep.memory.parentTaskRaw) {
        return;
    }
    if (!creep.memory.parentTask) {
        prepare(creep);
    }
    //如果没有索引就新建一个
    if (!creep.memory.index) {
        creep.memory.index = 0;
    }
    //获取到的参数数不符合所需要的参数数就清除并log
    if (
        creep.memory.task.p.length != tasks[creep.memory.parentTask].paramLenget
    ) {
        Game.notify(`获取到的参数和所需要的不同！
        RAW：${creep.memory.parentTaskRaw}`);
        creep.memory.parentTask = null;
        creep.memory.task = null;
        creep.memory.parentTaskRaw = null;
    }

    if (tasks[creep.memory.parentTask].task[creep.memory.index]) {
        if (tasks[creep.memory.parentTask].task[creep.memory.index](creep)) {
            creep.memory.task.p.shift();
            creep.memory.index++;
        }
    } else {
        // 在做完任务后清除任务
        creep.memory.parentTask = null;
        creep.memory.parentTaskRaw = null;
        creep.memory.task = null;
    }
}
