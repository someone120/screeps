//@ts-nocheck
import { filter } from 'whiteList';
import { creepExt } from 'ScreepsBase';
import { unlockRoom } from '../cache/room/protect';

export class remoteProtector extends creepExt {
    work(): void {
        super.work()
        this.say('🤺',true)
        this.room.addRestrictedPos(this.name,this.pos)

        if (this.ticksToLive < 10||this.hitsMax-this.hits<=100) {
            unlockRoom(this.memory.protectRoomId);

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
            filter: filter
        });
        if (enemyCreep.length > 0) {
            if (this.attack(enemyCreep[0]) == ERR_NOT_IN_RANGE) {
                this.goTo(enemyCreep[0].pos);
            }
            return;
        }
        const enemyStr = this.room.find(FIND_HOSTILE_STRUCTURES, {
            filter: filter
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
            this.goTo(protectRoom.getPositionAt(20, 20),1);
            return;
        }
        if (this.hitsMax - this.hits > 0) {
            this.heal(this);
        }
        this.room.addRestrictedPos(this.name,this.pos)
    }
    
    type: Number = 12;
}
