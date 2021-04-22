import {
    getMinerFirstAvailableFlag,
    getReserverFirstAvailableFlag
} from 'flag';
import { pushSpawnTask } from 'mount/tasks/task.manager';
import { getSourceFlags } from 'utils';
import {lockRoom, roomStat} from "../cache/room/protect";

//TODO
const functions: ((Room: Room, available: number) => boolean)[] = [
    checkHarvester,
    checkCarrier,
    checkWorker,
    checkRemoteWorkers,
    checkWallPainter,
    checkManager
];

export default function(spawn: StructureSpawn) {
    if (!Memory.type) {
        Memory.type = {};
    }
    if (
        !Memory.type[spawn.room.name] ||
        Memory.type[spawn.room.name].length <= 0
    ) {
        Memory.type[spawn.room.name] = Array(12).fill(0);
    }
    if (!spawn.spawning) {
        let available = getAvailable(spawn);
        doing(spawn.room, available, functions);
    }
}

function getAvailable(spawn: StructureSpawn) {
    let available =
        Memory.type[spawn.room.name][2] == 0 ||
        Memory.type[spawn.room.name][0] == 0
            ? spawn.room.energyAvailable
            : spawn.room.energyCapacityAvailable;
    if (available >= 10000) {
        available = 10000;
    } else if (available >= 5600) {
        available = 5600;
    } else if (available >= 2300) {
        available = 2300;
    } else if (available >= 1800) {
        available = 1800;
    } else if (available >= 1300) {
        available = 1300;
    } else if (available >= 800) {
        available = 800;
    } else if (available >= 550) {
        available = 550;
    } else {
        available = 300;
    }
    return available;
}

function doing(
    room: Room,
    available: number,
    functions: ((Room: Room, available: number) => boolean)[]
) {
    functions.forEach((it) => {
        it(room, available);
    });
}

function checkHarvester(Room: Room, available: number): boolean {
    const freeSource = Room.findUnlockSource(
        Room.sources.map((it) => {
            return it.id;
        })
    );
    if (!freeSource) {
        return false;
    }
    pushSpawnTask(`Harvester ${available} ${freeSource}`, Room.name, true);
    return true;
}

function checkCarrier(Room: Room, available: number): boolean {
    if (Memory.type[Room.name][2] < 2) {
        pushSpawnTask(`Carrier ${available}`, Room.name, true);
        return true;
    }
    return false;
}
function checkWorker(Room: Room, available: number): boolean {
    if (
        Memory.type[Room.name][1] +
            Memory.type[Room.name][3] +
            Memory.type[Room.name][10] +
            Memory.type[Room.name][11] +
            Memory.type[Room.name][4] <
        4
    ) {
        pushSpawnTask(`Worker ${available}`, Room.name);
        return true;
    }
    return false;
}

function checkRemoteWorkers(Room: Room, available: number): boolean {
    let flag = getMinerFirstAvailableFlag();
    if (flag) {
        pushSpawnTask(`RemoteMiner ${available} ${flag}`, Room.name);
    }
    flag = getReserverFirstAvailableFlag();
    if (flag) {
        pushSpawnTask(`Reserver ${available} ${flag}`, Room.name);
    }
    let flags = getSourceFlags();
    if (flags.length * 2 > Memory.type[Room.name][7]) {
        pushSpawnTask(`RemoteCarrier ${available}`, Room.name);
    }
    if (flag && Memory.type[Room.name][12] < getSourceFlags().length) {
        flags.forEach((it) => {
            if (it.room && !roomStat(it.room.name)) {
                pushSpawnTask(
                    `Protector ${available} ${it.room.name}`,
                    it.room.name
                );
                lockRoom(it.room.name);
            }
        });
    }
    return true;
}

function checkWallPainter(Room: Room, available: number): boolean {
    if (Memory.type[Room.name][11] < 2) {
        pushSpawnTask(`WallPainter ${available}`, Room.name);
        return true;
    }
    return false;
}
function checkManager(Room: Room, available: number): boolean {
    if (Memory.type[Room.name][8] < 1 && (Room.controller?.level || 0) >= 5) {
        pushSpawnTask(`energyTransfer ${available}`, Room.name, true);
        return true;
    }
    return false;
}
