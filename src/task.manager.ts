class task {
    run(creep: Creep, text: String): Boolean {
        let split = text.split(' ');
        let moveCreep = Game.creeps[split[1]];
        if (!moveCreep) {
            creep.memory['task'] = null;
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
export function pushCarrierTask(task: String) {
    if (Memory['porterTasker'].includes(task)) {
        return;
    }
    Memory['porterTasker'].push(task);
}

/**
 * 向任务列表中推送任务
 * @param task 任务
 */
export function pushSpawnTask(task: String) {
    if (
        Memory['spawnTask'].find((it) => {
            return it == task;
        })
    ) {
        return;
    }
    Memory['spawnTask'].push(task);
}

export class transfer extends task {
    run(creep: Creep, text: String): Boolean {
        let split = text.split(' ');
        let moveCreep = Game.creeps[split[1]];
        if (!super.run(creep, text)) {
            creep.memory['task'] = null;
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
            creep.memory['task'] = null;
        }

        return true;
    }
}

export class carry extends task {
    run(creep: Creep, text: String): Boolean {
        let split = text.split(' ');
        let storage = Game.structures[split[1]];
        if (!storage) {
            creep.memory['task'] = null;
            return false;
        }
        if (!global[creep.name]) global[creep.name] = 0;
        if (global[creep.name] == 0) creep.memory['getting'] = true;
        global[creep.name]++;
        if (creep.memory['getting']) {
            if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storage);
            } else {
                creep.memory['getting'] = false;
            }
        } else {
            let targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_TOWER ||
                            structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity
                    );
                },
            });

            if (
                creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0 &&
                targets.length > 0
            ) {
                let result = creep.transfer(targets[0], RESOURCE_ENERGY);

                if (result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else {
                creep.memory['task'] = null;
                Game.spawns[split[2]].memory['isSend'] = false;
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
            let targets = Game.structures[split[2]];

            if (creep.store[RESOURCE_ENERGY] > 0) {
                let result = creep.transfer(targets, RESOURCE_ENERGY);

                if (result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets);
                } else if (result == ERR_FULL) {
                    creep.memory['task'] = null;
                }
            }else{
                creep.memory['task'] = null;
            }
        }
        return true;
    }
}
