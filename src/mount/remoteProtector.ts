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
            this.goTo(new RoomPosition(20, 20, this.memory.protectRoomId));
            return;
        }
        if (this.room.name !== protectRoom.name) {
            this.goTo(new RoomPosition(20, 20, this.memory.protectRoomId));
            return;
        }
        const enemyCreep = this.room.find(FIND_HOSTILE_CREEPS, {
            filter: (it) => {
                return !WHITE_LIST.includes(it.owner.username);
            }
        });
        if (enemyCreep.length > 0) {
            if (this.attack(enemyCreep[0]) == ERR_NOT_IN_RANGE) {
                this.goTo(enemyCreep[0].pos);
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
                this.goTo(enemyStr[0].pos);
            }
            return;
        }
        if (
            this.pos.x <= 1 ||
            this.pos.x >= 48 ||
            this.pos.y <= 1 ||
            this.pos.y >= 48
        ) {
            this.goTo(protectRoom.getPositionAt(20, 20));
            return;
        }
        if (this.hitsMax - this.hits > 0) {
            this.heal(this);
        }
    }
    task: string;
    type: Number = 12;
}
