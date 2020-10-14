import { creep } from './base';
//获取energy

export class harvester extends Creep implements creep {
    task: String;
    type: Number = 0;
    work() {
        if (this.memory['request'] == 0) {
            this.memory['full'] = false;
        }
        let path = this.room.getPositionAt(16,6);
        let target = this.room.getPositionAt(16,7).lookFor(LOOK_SOURCES)[0];
        let result = path.lookFor(LOOK_CREEPS);
        if (result.length != 0 && result[0].id != this.id) {
            target = this.room.getPositionAt(15,7).lookFor(LOOK_SOURCES)[0];
        }
        if (this.harvest(target) == ERR_NOT_IN_RANGE) {
            this.moveTo(target);
        }

        if (this.memory['full'] === undefined) {
            this.memory['full'] = false;
        }
        if (this.store.getFreeCapacity() == 0 && !this.memory['full']) {
            this.memory['full'] = true;
            Memory['porterTasker'].push('transfer ' + this.name);
        }
    }
}
