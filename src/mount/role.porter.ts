import { creepExt } from 'base';
import {
    carry,
    pushCarrierTask,
    request as requestEneryge,
    transfer
} from 'task.manager';
/**
 * 从任务列表中提取一个任务
 */
function getTask(): string {
    let task = Memory.porterTasker.shift();
    global.porterTasksTaken.push(task);
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
            creep.memory['parentTask'] = null;
            break;
    }
    if (nowTask) nowTask.run(creep, text);
}
export class Carrier extends Creep implements creepExt {
    task: string;
    type: Number = 2;
    work() {
        if (this.ticksToLive <= 10 && this.memory['parentTask']) {
            pushCarrierTask(this.memory['parentTask'], this.name);
            let index = global.porterTasksTaken.indexOf(
                this.memory['parentTask']
            );
            if (index != -1) global.porterTasksTaken.splice(index, 1);
            this.memory['parentTask'] = null;
            global[this.name] = -1;
            this.say('要死要死', true);
        }
        if (this.memory['parentTask'] == null) {
            if (this.ticksToLive > 10 && this.store[RESOURCE_ENERGY] > 50) {
                this.memory['parentTask'] = getTask();
            } // 获取任务列表里的任务
            if (this.memory['parentTask'] != null) {
                global[this.name] = 0;
                console.log(`${this.name} 接下了 ${this.memory['parentTask']}`);
                return;
            }

            const targets = Game.rooms[this.memory.roomID].storage;
            if (
                targets &&
                targets.store.getUsedCapacity(RESOURCE_ENERGY) > 100
            ) {
                const result = this.withdraw(targets, RESOURCE_ENERGY);
                if (result == ERR_NOT_IN_RANGE) {
                    this.goTo(targets.pos);
                }
                return;
            }
            const source2 = Game.rooms[this.memory.roomID].find(
                FIND_STRUCTURES,
                {
                    filter: (structure) => {
                        return (
                            structure.structureType == STRUCTURE_CONTAINER &&
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
                    this.goTo(source2[0].pos);
                }
                return;
            }
            const source1 = Game.rooms[this.memory.roomID].find(
                FIND_DROPPED_RESOURCES,
                {
                    filter: (it) => {
                        return it.resourceType == RESOURCE_ENERGY;
                    }
                }
            )[0];
            if (this.pickup(source1) == ERR_NOT_IN_RANGE) {
                this.goTo(source1.pos);
            }
        } else {
            parseTask(this.memory['parentTask'], this);
        }
    }
}
