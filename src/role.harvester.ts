import { creep } from './base';
import { getSourceLink } from './util';
//获取energy
export class harvester extends Creep implements creep {
    task: string;
    type: Number = 0;
    work() {
        if (getSourceLink().store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            this.transfer(getSourceLink(), RESOURCE_ENERGY);
        }
        if (this.memory['request'] == 0) {
            this.memory['full'] = false;
        }
        let path = this.room.getPositionAt(16, 6);
        let target = this.room.getPositionAt(16, 7).lookFor(LOOK_SOURCES)[0];
        let result = path.lookFor(LOOK_CREEPS);
        if (result.length != 0 && result[0].id != this.id) {
            target = this.room.getPositionAt(15, 7).lookFor(LOOK_SOURCES)[0];
            path = this.room.getPositionAt(16, 8);
        }
        if (!path.isEqualTo(this.pos)) {
            this.moveTo(path);
        } else if (this.harvest(target) == ERR_NOT_IN_RANGE) {
            this.moveTo(target);
        }
    }
}
