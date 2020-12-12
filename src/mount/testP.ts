import { creepExt } from 'base';
import { get } from 'https';
import { doing } from 'newTaskManager';
function getTask(): string {
    let task = Memory.porterTasker.shift();
    global.porterTasksTaken.push(task);
    return task;
}
export class Carrie extends Creep implements creepExt {
    task: string;
    type: Number = 2;
    work() {
        if (this.memory.parentTaskRaw || this.memory.parentTask) {
            doing(this);
            return;
        } else {
            this.memory.parentTaskRaw = getTask();
            if (this.memory.parentTaskRaw) {
                doing(this);
            }
        }
    }
}
