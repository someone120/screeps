import { creepExt } from 'base';
import { unlockRoom } from './cache/room/protect';

export class remoteProtector extends Creep implements creepExt {
    work(): void {
        if (this.ticksToLive < 10 || this.hits <= 50) {
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
        const enemyCreep = this.room.find(FIND_HOSTILE_CREEPS);
        if (enemyCreep.length > 0) {
            if (this.attack(enemyCreep[0]) == ERR_NOT_IN_RANGE) {
                this.goTo(enemyCreep[0].pos);
            }
        }
        const enemyStr = this.room.find(FIND_HOSTILE_STRUCTURES);
        if (enemyStr.length > 0) {
            if (this.attack(enemyStr[0]) == ERR_NOT_IN_RANGE) {
                this.goTo(enemyStr[0].pos);
            }
        }
        if (
            this.pos.x <= 1 ||
            this.pos.x >= 48 ||
            this.pos.y <= 1 ||
            this.pos.y >= 48
        ) {
            this.goTo(protectRoom.getPositionAt(20, 20));
        }
    }
    task: string;
    type: Number = 12;
}
