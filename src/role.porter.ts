import { creep } from './base';
import {
    carry,
    pushCarrierTask,
    request as requestEneryge,
    transfer
} from './task.manager';
/**
 * 从任务列表中提取一个任务
 */
function getTask(): string {
    let task = Memory.porterTasker.shift();
    global['porterTasksTaken'].push(task);
    return task;
}
/**
 * 解析任务并执行
 *
 * @param task 获取到的任务
 * @param creep
 */
function parseTask(text: string, creep: Creep) {
    const split = text.split(' ');
    let nowTask;
    switch (split[0]) {
        case 'transfer': //转移资源任务 格式'transfer name'
            nowTask = new transfer();
            break;
        case 'carry':
            nowTask = new carry();
            break;
        case 'requestEneryge':
            nowTask = new requestEneryge();
            break;
        default:
            creep.memory['task'] = null;
            break;
    }
    if (nowTask) nowTask.run(creep, text);
}
export class Carrier extends Creep implements creep {
    task: string;
    type: Number = 2;
    work() {
        if (this.memory['task'] == null) {
            if (
                this.ticksToLive > 10 &&
                Game.rooms[this.memory.roomID].storage &&
                Game.rooms[this.memory.roomID].storage.store.getUsedCapacity() >
                    0
            ) {
                this.memory['task'] = getTask();
            } // 获取任务列表里的任务
            if (this.memory['task'] != null) {
                global[this.name] = 0;
                console.log(`${this.name} 接下了 ${this.memory['task']}`);
                return;
            }
            if (this.store.getUsedCapacity() > 0) {
                const targets = Game.rooms[this.memory.roomID].storage;
                if (targets) {
                    const result = this.transfer(targets, RESOURCE_ENERGY);
                    if (result == ERR_NOT_IN_RANGE) {
                        this.moveTo(targets);
                    }
                }
            } else {
                const targets = Game.rooms[this.memory.roomID].storage;
                if (
                    targets &&
                    targets.store.getUsedCapacity(RESOURCE_ENERGY) > 100
                ) {
                    const result = this.withdraw(targets, RESOURCE_ENERGY);
                    if (result == ERR_NOT_IN_RANGE) {
                        this.moveTo(targets);
                    }
                    return;
                }
                const source2 = Game.rooms[this.memory.roomID].find(
                    FIND_STRUCTURES,
                    {
                        filter: (structure) => {
                            return (
                                structure.structureType ==
                                    STRUCTURE_CONTAINER &&
                                structure.store.energy > 0
                            );
                        }
                    }
                ) as StructureContainer[];
                source2.sort((a, b) => {
                    return b.store.energy - a.store.energy;
                });
                if (source2.length != 0) {
                    const result = this.withdraw(source2[0], RESOURCE_ENERGY);
                    if (result == ERR_NOT_IN_RANGE) {
                        this.moveTo(source2[0]);
                    }
                } else {
                    const source1 = Game.rooms[this.memory.roomID].find(
                        FIND_DROPPED_RESOURCES
                    )[0];
                    if (this.pickup(source1) == ERR_NOT_IN_RANGE) {
                        this.moveTo(source1, {
                            visualizePathStyle: { stroke: '#ffaa00' }
                        });
                    }
                }
            }
        } else if (this.ticksToLive <= 10) {
            pushCarrierTask(this.memory['task'], this.name);
            let index = global['porterTasksTaken'].indexOf(this.memory['task']);
            if (index != -1) global['porterTasksTaken'].splice(index, 1);
            this.memory['task'] = null;
            global[this.name] = -1;
            this.say('要死要死', true);
        } else {
            parseTask(this.memory['task'], this);
        }
    }
}
