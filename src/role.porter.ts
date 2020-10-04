import { creep } from './base';

let tasks = require('task.manager');

/**
 * 从任务列表中提取一个任务
 */
function getTask(): String {
    return Memory['porterTasker'].shift();
}

/**
 * 解析任务并执行
 *
 * @param task 获取到的任务
 * @param creep
 */
function parseTask(text: String, creep: Creep) {
    let split = text.split(' ');
    let nowTask;
    switch (split[0]) {
        case 'move': //移动任务
            nowTask = new tasks.move();
            break;
        case 'transfer': //转移资源任务 格式'transfer name'
            nowTask = new tasks.transfer();
            break;
        default:
            break;
    }
    nowTask.run(creep, text);
}

export class Carrier extends Creep implements creep {
    task: String;
    type: Number = 2;
    work() {
        if (this.memory['task'] == null) {
            // 没有任务时
            this.memory['task'] = getTask(); // 获取任务列表里的任务
            if (this.memory['task'] != null)
                console.log(`${this.name} 接下了 ${this.memory['task']}`);

            if (this.store.getUsedCapacity() > 0) {
                let targets = this.room.find(FIND_STRUCTURES, {
                    /* 这是一个过滤器，过滤建筑，返回建筑类型是扩展或者虫巢，条件是未满载的*/
                    filter: (structure) => {
                        return (
                            (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) &&
                            structure.energy < structure.energyCapacity
                        );
                    },
                });
                if (
                    this.transfer(targets[0], RESOURCE_ENERGY) ==
                    ERR_NOT_IN_RANGE
                ) {
                    this.moveTo(targets[0]);
                }
            } else {
                let source2 = this.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            structure.structureType == STRUCTURE_CONTAINER &&
                            structure.store.energy > 0
                        );
                    },
                })[0]
                if (
                    this.withdraw(source2, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
                ) {
                    this.moveTo(source2);
                }
            }
        } else {
            parseTask(this.memory['task'], this);
        }
    }
}
