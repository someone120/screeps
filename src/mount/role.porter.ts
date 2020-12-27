import { creepExt } from 'base';
import { doing } from 'task.manager';
function getTask(roomName: string): string | undefined{
    if (!Memory.porterTasker) {
        Memory.porterTasker = {};
    }
    if (!Memory.porterTasker[roomName]) {
        Memory.porterTasker[roomName] = [];
        return undefined;
    }
    let task = Memory.porterTasker[roomName].shift();
    if (task) {
        global.porterTasksTaken.push(task);
    }
    return undefined;
}
export class Carrier extends Creep implements creepExt {
    type: Number = 2;
    work() {
        if (this.memory.parentTaskRaw || this.memory.parentTask) {
            doing(this);
            return;
        } else {
            this.memory.parentTaskRaw = getTask(this.room.name);
            if (this.memory.parentTaskRaw) {
                doing(this);
            }
        }
    }
}
