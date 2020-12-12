import { structure } from './base';
import { indexOf } from 'lodash';
class task {
    run(creep: Creep, text: string): Boolean {
        let split = text.split(' ');
        let structure = Game.getObjectById(split[1] as Id<StructureContainer>);

        if (!structure) {
            finishTask(creep);
            return false;
        }
        return true;
    }
}
/**
 * 向任务列表中推送任务
 * @param task 任务
 */
export function pushCarrierTask(task: string, name: string) {
    if (!Memory.porterTasker) {
        Memory.porterTasker=[]
    }
    if (
        !(
            Memory.porterTasker.includes(task) ||
            global.porterTasksTaken.includes(task)
        )
    ) {
        console.log(
            `<p style="color: #8BC34A;">[${name}]发布了任务：${task}</p>`
        );
        Memory.porterTasker.push(task);
    }
}
/**
 * 向任务列表中推送任务
 * @param task 任务
 */
export function pushSpawnTask(task: string, name: string) {
    if (!Memory.spawnTask) {
        Memory.spawnTask = {};
    }
    if (!Memory.spawnTask[name]) {
        Memory.spawnTask[name] = [];
    }
    if (!global.spawnTask) {
        global.spawnTask = {};
    }
    if (
        !(
            Memory.spawnTask[name].includes(task) ||
            global.spawnTask[name]==task
        )
    ) {
        console.log(
            `<p style="color: #8BC34A;">[${name}]发布了任务：${task}</p>`
        );
        Memory.spawnTask[name].push(task);
    }
}
function finishTask(creep: Creep) {
    let index = global.porterTasksTaken.indexOf(creep.memory['parentTask']);
    if (index != -1) global.porterTasksTaken.splice(index, 1);
    creep.memory['parentTask'] = null;
    global[creep.name] = -1;
}
export class transfer extends task {
    run(creep: Creep, text: string): Boolean {
        let split = text.split(' ');
        let structure = Game.getObjectById(split[1] as Id<StructureContainer>);
        if (!super.run(creep, text)) {
            finishTask(creep);
            return false;
        }
        if (
            creep.withdraw(structure, split[2] as ResourceConstant) ==
                ERR_NOT_IN_RANGE &&
            creep.store.getFreeCapacity() > 0
        ) {
            creep.goTo(structure.pos);
        } else {
            finishTask(creep);
        }
        return true;
    }
}
export class carry extends task {
    run(creep: Creep, text: string): Boolean {
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
                    creep.goTo(storage.pos);
                } else {
                    creep.memory['getting'] = false;
                }
            }
        } else {
            let targets = Game.spawns[split[2]];
            if (creep.store[RESOURCE_ENERGY] > 0) {
                let result = creep.transfer(targets, RESOURCE_ENERGY);
                if (result == ERR_NOT_IN_RANGE) {
                    creep.goTo(targets.pos);
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
    run(creep: Creep, text: string): Boolean {
        let split = text.split(' ');
        let storage = Game.structures[split[1]];
        if (!global[creep.name]) global[creep.name] = 0;
        if (global[creep.name] == 0) creep.memory['getting'] = true;
        global[creep.name]++;
        if (creep.memory['getting'] && creep.store[RESOURCE_ENERGY] < 50) {
            if (!storage) {
                creep.memory['getting'] = false;
                return;
            }
            if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.goTo(storage.pos);
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
                    creep.goTo(targets.pos);
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
