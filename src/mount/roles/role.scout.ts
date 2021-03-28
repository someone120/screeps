//@ts-nocheck
import { creepExt } from 'base';
import { setScoutAvailableFlag } from 'flag';
import { random } from 'lodash';
import { encodee } from 'utils';
export class Scort extends creepExt {
    type: Number = 9;
    work(): void {
        super.work()
        if (!Memory.rooms[this.room.name]) Memory.rooms[this.room.name] = {};

        if (Memory.rooms[this.room.name].source) {
            goToNextRoom(this.room.name, this);
            if (!Memory.beScoutRoom.includes(this.room.name)) {
                Memory.beScoutRoom.push(this.room.name);
            }
            return;
        }
        if (!Memory.rooms[this.room.name].source)
            Memory.rooms[this.room.name].source = [];
        let source = this.room.find(FIND_SOURCES);
        for (let i = 0; i < source.length; i++) {
            Memory.rooms[this.room.name].source[i] = source[i].id;
        }
        Memory.beScoutRoom.push(this.room.name);
    }
}
function goToNextRoom(
    roomName: string,
    creep: Creep
): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND {
    let exits = Game.map.describeExits(roomName);
    if (!Memory.beScoutRoom) Memory.beScoutRoom = [];
    for (let i of Object.values(exits)) {
        if (!Memory.beScoutRoom.includes(i)) {
            return creep.goTo(new RoomPosition(25, 25, i));
        }
    }
}
