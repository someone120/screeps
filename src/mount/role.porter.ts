import { creepExt } from 'base';
import { doing } from 'task.manager';
function getTask(roomName:string): string {
    let task = Memory.porterTasker[roomName].shift();
    global.porterTasksTaken.push(task);
    return task;
}
export class Carrier extends Creep implements creepExt {
    task: string;
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
