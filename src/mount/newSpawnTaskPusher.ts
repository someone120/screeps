import { pushSpawnTask } from 'task.manager';

//TODO
const functions: ((Room: Room, available: number) => boolean)[] = [
    checkHarvester,
    checkCarrier
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
        let available = spawn.room.energyCapacityAvailable;
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
        } else if (available >= 300) {
            available = 300;
        }
        doing(spawn.room, available, functions);
    }
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
    let sources = Room.sources;
    if (sources.length > Memory.type[Room.name][0]) {
        pushSpawnTask(`Harvester ${available}`, Room.name, true);
        return true;
    }
    return false;
}

function checkCarrier(Room: Room, available: number): boolean {
    if (Memory.type[Room.name][2] < 2) {
        pushSpawnTask(`Carrier ${available}`, Room.name, true);
        return true;
    }
    return false;
}
