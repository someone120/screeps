import { creep } from './base';
import {
    carry,


    pushCarrierTask, request as requestEneryge, transfer
} from './task.manager';

/**
 * 从任务列表中提取一个任务
 */
function getTask(): String {
    return Memory.porterTasker.shift();
}

/**
 * 解析任务并执行
 *
 * @param task 获取到的任务
 * @param creep
 */
function parseTask(text: String, creep: Creep) {
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
    task: String;
    type: Number = 2;
    work() {
        if (this.memory['task'] == null) {
            if (this.ticksToLive > 10 && this.store.getUsedCapacity() > 0) {
                this.memory['task'] = getTask();
            } // 获取任务列表里的任务
            if (this.memory['task'] != null) {
                global[this.name] = 0;
                console.log(`${this.name} 接下了 ${this.memory['task']}`);
                this.say('呜呜呜去打工去打工', true);
                return;
            }
            if (this.store.getUsedCapacity() > 0) {
                const targets = this.room.storage;
                if (targets) {
                    const result = this.transfer(targets, RESOURCE_ENERGY);
                    if (result == ERR_NOT_IN_RANGE) {
                        this.moveTo(targets);
                    }
                }
            } else {
                const source2 = this.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            structure.structureType == STRUCTURE_CONTAINER &&
                            structure.store.energy > 0
                        );
                    },
                }) as StructureContainer[];

                source2.sort((a, b) => {
                    return b.store.energy - a.store.energy;
                });

                if (source2.length != 0) {
                    const result = this.withdraw(source2[0], RESOURCE_ENERGY);

                    if (result == ERR_NOT_IN_RANGE) {
                        this.moveTo(source2[0]);
                    }
                } else {
                    const source1 = this.room.find(FIND_DROPPED_RESOURCES)[0];
                    if (this.pickup(source1) == ERR_NOT_IN_RANGE) {
                        this.moveTo(source1, {
                            visualizePathStyle: { stroke: '#ffaa00' },
                        });
                    }
                }
            }
        } else if (this.ticksToLive <= 10) {
            pushCarrierTask(this.memory['task'], this.name);
            this.say('呜呜呜要死了要死了', true);
        } else {
            parseTask(this.memory['task'], this);
        }
    }
}
