import { creepExt } from 'base';
import { WHITE_LIST } from 'utils';
import { unlockRoom } from './cache/room/protect';

export class remoteProtector extends Creep implements creepExt {
    work(): void {
        if (this.ticksToLive < 10) {
            unlockRoom(this.memory.protectRoomId);
            this.suicide();
        }
        const protectRoom: Room = Game.rooms[this.memory.protectRoomId];
        if (!protectRoom) {
            this.farMoveTo(new RoomPosition(20, 20, this.memory.protectRoomId),1);
            return;
        }
        if (this.room.name !== protectRoom.name) {
            this.farMoveTo(new RoomPosition(20, 20, this.memory.protectRoomId),1);
            return;
        }
        const enemyCreep = this.room.find(FIND_HOSTILE_CREEPS, {
            filter: (it) => {
                return !WHITE_LIST.includes(it.owner.username);
            }
        });
        if (enemyCreep.length > 0) {
            if (this.attack(enemyCreep[0]) == ERR_NOT_IN_RANGE) {
                this.farMoveTo(enemyCreep[0].pos,1);
            }
            return;
        }
        const enemyStr = this.room.find(FIND_HOSTILE_STRUCTURES, {
            filter: (it) => {
                return !WHITE_LIST.includes(it.owner.username);
            }
        });
        if (enemyStr.length > 0) {
            if (this.attack(enemyStr[0]) == ERR_NOT_IN_RANGE) {
                this.farMoveTo(enemyStr[0].pos,1);
            }
            return;
        }
        if (
            this.pos.x <= 1 ||
            this.pos.x >= 48 ||
            this.pos.y <= 1 ||
            this.pos.y >= 48
        ) {
            this.farMoveTo(protectRoom.getPositionAt(20, 20),1);
            return;
        }
        if (this.hitsMax - this.hits > 0) {
            this.heal(this);
        }
    }
    task: string;
    type: Number = 12;
}
