class task {
    run(creep: Creep, text: String): Boolean {
        let split = text.split(' ');
        let moveCreep = Game.creeps[split[1]];
        if (!moveCreep) {
            finishTask(creep);
            return false;
        }
        moveCreep.memory['request'] = -1;
        return true;
    }
}
/**
 * 向任务列表中推送任务
 * @param task 任务
 */
export function pushCarrierTask(task: String, name: String) {
    if (Memory.porterTasker.includes(task)) {
        return;
    }
    console.log(`<p style="color: #8BC34A;">[${name}]发布了任务：${task}</p>`);
    Memory.porterTasker.push(task);
}

/**
 * 向任务列表中推送任务
 * @param task 任务
 */
export function pushSpawnTask(task: String, name: String) {
    if (Memory['spawnTask'].includes(task)) {
        return;
    }
    console.log(`<p style="color: #8BC34A;">[${name}]发布了任务：${task}</p>`);
    Memory['spawnTask'].push(task);
}

function finishTask(creep: Creep) {
    creep.memory['task'] = null;
    global[creep.name] = -1;
    creep.say(`好诶！赚到了${~~(100 + Math.random() * 200)}円`,true);
}

export class transfer extends task {
    run(creep: Creep, text: String): Boolean {
        let split = text.split(' ');
        let moveCreep = Game.creeps[split[1]];
        if (!super.run(creep, text)) {
            finishTask(creep);
            return false;
        }
        if (
            moveCreep.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE &&
            creep.store.getFreeCapacity() > 0
        ) {
            creep.moveTo(moveCreep, {
                visualizePathStyle: { stroke: '#ffaa00' },
            });
        } else {
            moveCreep.memory['full'] = false;
            finishTask(creep);
        }

        return true;
    }
}

export class carry extends task {
    run(creep: Creep, text: String): Boolean {
        let split = text.split(' ');
        let storage = Game.structures[split[1]];
        if (!global[creep.name]) global[creep.name] = 0;
        if (global[creep.name] == 0) creep.memory['getting'] = true;
        global[creep.name]++;
        if (creep.memory['getting']) {
            if (!storage) {
                creep.memory['getting'] = false;
            } else {
                if (
                    creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
                ) {
                    creep.moveTo(storage);
                } else {
                    creep.memory['getting'] = false;
                }
            }
        } else {
            let targets = Game.spawns[split[2]];

            if (creep.store[RESOURCE_ENERGY] > 0) {
                let result = creep.transfer(targets, RESOURCE_ENERGY);

                if (result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets);
                } else if (result == ERR_FULL) {
                    finishTask(creep);
                }
            } else {
                finishTask(creep);
            }
        }
        return true;
    }
}

export class request extends task {
    run(creep: Creep, text: String): Boolean {
        let split = text.split(' ');
        let storage = Game.structures[split[1]];

        if (!global[creep.name]) global[creep.name] = 0;
        if (global[creep.name] == 0) creep.memory['getting'] = true;
        global[creep.name]++;
        if (creep.memory['getting'] && creep.store[RESOURCE_ENERGY] <= 50) {
            if (!storage) {
                creep.memory['getting'] = false;
                return;
            }
            if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storage);
            } else {
                creep.memory['getting'] = false;
            }
        } else {
            let targets = Game.structures[split[2]];
            if (
                targets.store &&
                targets.store.getFreeCapacity(RESOURCE_ENERGY) == 0
            ) {
                finishTask(creep);
                return;
            }
            if (creep.store[RESOURCE_ENERGY] > 0) {
                let result = creep.transfer(targets, RESOURCE_ENERGY);

                if (result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets);
                } else if (result == ERR_FULL) {
                    finishTask(creep);
                }
            } else {
                finishTask(creep);
            }
        }
        return true;
    }
}
