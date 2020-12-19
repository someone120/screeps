import { isContainer, isStorage } from 'utils';
/**
 * 向任务列表中推送任务
 * @param task 任务
 */
export function pushCarrierTask(task: string, roomName: string, name: string) {
    if (!Memory.porterTasker) {
        Memory.porterTasker = {};
    }
    if (!Memory.porterTasker[roomName]) {
        Memory.porterTasker[roomName] = [];
    }
    if (
        !(
            Memory.porterTasker[roomName].includes(task) ||
            global.porterTasksTaken.includes(task)
        )
    ) {
        console.log(
            `<p style="color: #8BC34A;">[${name}]发布了任务：${task}</p>`
        );
        Memory.porterTasker[roomName].push(task);
    }
}
/**
 * 向任务列表中推送任务
 * @param task 任务
 */
export function pushSpawnTask(
    task: string,
    RoomName: string,
    SpawnName: string
) {
    if (!Memory.spawnTask) {
        Memory.spawnTask = {};
    }
    if (!Memory.spawnTask[RoomName]) {
        Memory.spawnTask[RoomName] = [];
    }
    if (!global.spawnTask) {
        global.spawnTask = {};
    }
    if (
        !(
            Memory.spawnTask[RoomName].includes(task) ||
            global.spawnTask[SpawnName] == task
        )
    ) {
        console.log(
            `<p style="color: #8BC34A;">[${RoomName}]发布了任务：${task}</p>`
        );
        Memory.spawnTask[RoomName].push(task);
    }
}
const tasks: {
    [TaskName: string]: { task: ((creep) => boolean)[]; paramLenget: number };
} = {
    TransferMineral: { task: [withdraw, transfer], paramLenget: 4 },
    request: { task: [supply], paramLenget: 2 }
};

/** 转移资源
 * 需要两个参数，p[0]为目标，p[1]为需要的资源。
 */
export function transfer(creep: Creep): boolean {
    let obj = Game.getObjectById<Structure>(creep.memory.task.p[0]);
    if (!obj || !obj.store) {
        creep.memory.index--;
        return true;
    }
    const result = creep.transfer(
        obj,
        creep.memory.task.p[1] as ResourceConstant
    );
    if (
        result != ERR_NOT_IN_RANGE ||
        obj.store.getFreeCapacity(creep.memory.task.p[1] as ResourceConstant) ==
            0
    ) {
        return true;
    }
    creep.goTo(obj.pos);
    return false;
}

/** 转移资源
 * 需要两个参数，p[0]为目标，p[1]为需要的资源。
 */
export function withdraw(creep: Creep): boolean {
    let obj = Game.getObjectById<Structure>(creep.memory.task.p[0]);
    if (!obj || !obj.store) {
        return true;
    }
    if (
        creep.withdraw(obj, creep.memory.task.p[1] as ResourceConstant) !=
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
    creep.memory.task = { type: creep.memory.parentTask, p: task };

    return true;
}

/** 供应资源
 * 需要两个参数，p[0]为目标，p[1]为需要的资源。
 * 在没有所需要的资源会自动寻找
 */
export function supply(creep: Creep): boolean {
    if (creep.store[creep.memory.task.p[1]] <= 0) {
        let target: StructureContainer | StructureStorage | Resource =
            creep.room.storage.store[creep.memory.task.p[1]] > 0
                ? creep.room.storage
                : (creep.pos.findClosestByRange(FIND_STRUCTURES, {
                      filter: (it) => {
                          return (
                              it.structureType == STRUCTURE_CONTAINER &&
                              it.store[creep.memory.task.p[1]] > 0
                          );
                      }
                  }) as StructureContainer) ||
                  creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                      filter: (it) => {
                          return it.resourceType == creep.memory.task.p[1];
                      }
                  });
        if (target) {
            if (isContainer(target)) {
                creep.withdraw(
                    target,
                    creep.memory.task.p[1] as ResourceConstant
                );
            } else if (isStorage(target)) {
                creep.withdraw(
                    target,
                    creep.memory.task.p[1] as ResourceConstant
                );
            } else {
                creep.pickup(target);
            }
            creep.goTo(target.pos);
        }
        return false;
    }
    let target = Game.getObjectById(creep.memory.task.p[0]) as Structure;
    if (!target.store) {
        return true;
    }
    if (
        creep.transfer(target, creep.memory.task.p[1] as ResourceConstant) ==
        ERR_NOT_IN_RANGE
    ) {
        creep.goTo(target.pos);
        return false;
    }
    return true;
}

export function doing(creep: Creep) {
    //如果没有任务就结束
    if (!creep.memory.parentTaskRaw) {
        return;
    }
    if (!creep.memory.parentTask || !creep.memory.task) {
        prepare(creep);
        // if (
        //     creep.memory.task.p.length !=
        //     tasks[creep.memory.parentTask].paramLenget
        // ) {
        //     Game.notify(`获取到的参数和所需要的不同！
        //     RAW：${creep.memory.parentTaskRaw}`);
        //     let index = global.porterTasksTaken.indexOf(
        //         creep.memory.parentTaskRaw
        //     );
        //     console.log(
        //         `${creep.name} ${creep.memory.parentTaskRaw} ${creep.memory.task.p}`
        //     );

        //     if (index != -1) global.porterTasksTaken.splice(index, 1);
        //     creep.memory.parentTask = null;
        //     creep.memory.task = null;
        //     creep.memory.parentTaskRaw = null;
        // }
        // return;
    }
    //如果没有索引就新建一个
    if (!creep.memory.index) {
        creep.memory.index = 0;
    }
    //获取到的参数数不符合所需要的参数数就清除并log
    if (
        tasks[creep.memory.parentTask] &&
        tasks[creep.memory.parentTask].task[creep.memory.index]
    ) {
        if (tasks[creep.memory.parentTask].task[creep.memory.index](creep)) {
            try {
                creep.memory.task.p.shift();
            } catch (error) {
                console.log(creep.name);
            }

            creep.memory.index++;
        }
    } else {
        // 在做完任务后清除任务
        let index = global.porterTasksTaken.indexOf(creep.memory.parentTaskRaw);
        // console.log(`${creep.name} ${creep.memory.parentTaskRaw}`);

        if (index != -1) global.porterTasksTaken.splice(index, 1);
        delete creep.memory.parentTask;
        delete creep.memory.parentTaskRaw;
        delete creep.memory.task;
        delete creep.memory.index;
    }
}
