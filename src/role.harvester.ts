import { base, creep } from './base';
//获取energy

export class harvester extends Creep implements creep {
    task: String;
    type: Number = 0;
    work() {
        let path = this.room.getPositionAt(5, 9);
        let target = this.room.getPositionAt(6, 8).lookFor(LOOK_SOURCES)[0];
        let resulta = path.lookFor(LOOK_CREEPS);
        if (resulta.length != 0 && resulta[0].id != this.id) {
            target = this.room.getPositionAt(40, 45).lookFor(LOOK_SOURCES)[0];
        }
        let result = this.harvest(target);

        if (this.memory['inPath'] === undefined) {
            this.memory['inPath'] = false;
        }
        if (result == ERR_NOT_IN_RANGE && !this.memory['inPath']) {
            this.memory['inPath'] = true;
            Memory['porterTasker'].push(
                'move ' + this.name + ' ' + target.pos.x + ' ' + target.pos.y
            );
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
