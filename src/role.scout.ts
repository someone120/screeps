import { creep } from 'base';
import { setScoutAvailableFlag } from 'flag';
export class Scort extends Creep implements creep {
    task: string;
    type: Number = 9;
    work(): void {
        if (!this.memory.flagName) {
            this.suicide();
            return;
        }
        if (this.ticksToLive <= 10) {
            setScoutAvailableFlag(this.memory.flagName);
            this.suicide();
            return;
        }
        let flag = Game.flags[this.memory.flagName];
        if (this.room != flag.room) {
            this.moveTo(flag.pos, { visualizePathStyle: { stroke: '#fff' } });
            return;
        } else {
            this.moveTo(20, 20);
            return;
        }
    }
}
