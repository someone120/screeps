import { creep } from './base';
//获取energy

export class harvester extends Creep implements creep {
    task: String;
    type: Number = 0;
    work() {
        let target=this.pos.findClosestByPath(FIND_SOURCES)
        let result = this.harvest(target);
        if (this.memory['request']===undefined) {
            this.memory['request']=-1
        }
        if (this.memory['request']>0) {
            this.memory['request']--
        }
        if (this.memory['request']==0) {
            this.memory['inPath'] = false;
            this.memory['full'] = false;
            this.memory['request']=-1
        }
        if (this.memory['inPath'] === undefined) {
            this.memory['inPath'] = false;
        }
        if (result == ERR_NOT_IN_RANGE && !this.memory['inPath']) {
            let path = this.room.getPositionAt(5, 9);
            let target = this.room.getPositionAt(6, 8).lookFor(LOOK_SOURCES)[0];
            let result = path.lookFor(LOOK_CREEPS);
            if (result.length != 0 && result[0].id != this.id) {
                target = this.room.getPositionAt(40, 45).lookFor(LOOK_SOURCES)[0];
            }
            this.memory['inPath'] = true;
            Memory['porterTasker'].push(
                'move ' + this.name + ' ' + target.pos.x + ' ' + target.pos.y
            );
            this.memory['request']=30
        }
        if (this.memory['full'] === undefined) {
            this.memory['full'] = false;
        }
        if (this.store.getFreeCapacity() == 0 && !this.memory['full']) {
            this.memory['full'] = true;
            Memory['porterTasker'].push('transfer ' + this.name);
            this.memory['request']=30
        }
    }
}
