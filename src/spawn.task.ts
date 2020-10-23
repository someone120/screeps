import { structure } from './base';
import { bodySet } from './setting';
import { assignPrototype } from './util';

export default class spawnExt extends StructureSpawn implements structure {
    work() {
        if (!Memory['spawnTask']) {
            Memory['spawnTask'] = [];
        }
        if (!global['spawnTask']) {
            global['spawnTask'] = getTask(Memory['spawnTask']);
        } else {
            if (
                this.room.energyAvailable <
                    parseInt(global['spawnTask'].split(' ')[1]) &&
                Memory['type'][2] <= 0 &&
                (global['spawnTask'].split(' ')[0] != 'Carrier' ||
                    parseInt(global['spawnTask'].split(' ')[1]) > 300)
            ) {
                Memory['spawnTask'].push(global['spawnTask']);
                global['spawnTask'] = null;
                return;
            }
            const result = parseTask(global['spawnTask'], this, this.room.name);
            if (result == OK) {
                global['spawnTask'] = null;
            }
        }
    }
}

function spawnNewHarvester(
    i: Number,
    spawn: StructureSpawn,
    roomID: String
): Number {
    let result = spawn.spawnCreep(
        bodySet.harvester[i + ''],
        `Miner@${Game.time}`,
        {
            memory: { type: 0, roomID: roomID },
        }
    );
    if (result == OK) {
        spawn.memory['send'] = false;
    }

    return result;
}
function spawnNewBuilder(
    i: Number,
    spawn: StructureSpawn,
    roomID: String
): Number {
    let result = spawn.spawnCreep(
        bodySet.builder[i + ''],
        `Builder@${Game.time}`,
        {
            memory: { type: 1, roomID: roomID },
        }
    );
    if (result == OK) {
        spawn.memory['send'] = false;
    }

    return result;
}
function spawnNewCarrier(
    i: Number,
    spawn: StructureSpawn,
    roomID: String
): Number {
    let result = spawn.spawnCreep(
        bodySet.carrier[i + ''],
        `Carrier@${Game.time}`,
        {
            memory: { type: 2, roomID: roomID },
        }
    );
    if (result == OK) {
        spawn.memory['send'] = false;
    }

    return result;
}
function spawnNewReserver(
    i: Number,
    spawn: StructureSpawn,
    roomID: String
): Number {
    let result = spawn.spawnCreep(
        bodySet.reserver[i + ''],
        `reserver@${Game.time}`,
        {
            memory: { type: 6, roomID: roomID },
        }
    );
    if (result == OK) {
        spawn.memory['send'] = false;
    }

    return result;
}
function spawnNewRemoteMiner(
    i: Number,
    spawn: StructureSpawn,
    roomID: String
): Number {
    let result = spawn.spawnCreep(
        bodySet.remoteMiner[i + ''],
        `RemoteMiner@${Game.time}`,
        {
            memory: { type: 5, roomID: roomID },
        }
    );
    if (result == OK) {
        spawn.memory['send'] = false;
    }

    return result;
}
function spawnNewRemoteCarrier(
    i: Number,
    spawn: StructureSpawn,
    roomID: String
): Number {
    let result = spawn.spawnCreep(
        bodySet.carrier[i + ''],
        `RemoteCarrier@${Game.time}`,
        {
            memory: { type: 7, roomID: roomID },
        }
    );
    if (result == OK) {
        spawn.memory['send'] = false;
    }

    return result;
}
function spawnNewUpgrader(
    i: Number,
    spawn: StructureSpawn,
    roomID: String
): Number {
    let result = spawn.spawnCreep(
        bodySet.upgrader[i + ''],
        `Upgrader@${Game.time}`,
        {
            memory: { type: 3, roomID: roomID },
        }
    );
    if (result == OK) {
        spawn.memory['send'] = false;
    }

    return result;
}
function getTask(tasks: String[]): String {
    return tasks.shift();
}
function parseTask(tasks: String, spawn: StructureSpawn, roomID): Number {
    let result: Number;
    let split = tasks.split(' ');
    if (!spawn.spawning) {
        switch (split[0]) {
            case 'Carrier':
                result = spawnNewCarrier(parseInt(split[1]), spawn, roomID);
                break;
            case 'Harvester':
                result = spawnNewHarvester(parseInt(split[1]), spawn, roomID);
                break;
            case 'Builder':
                result = spawnNewBuilder(parseInt(split[1]), spawn, roomID);
                break;
            case 'Upgrader':
                result = spawnNewUpgrader(parseInt(split[1]), spawn, roomID);
                break;
            case 'Repairer':
                result = spawnNewBuilder(parseInt(split[1]), spawn, roomID);
                break;
            case 'RemoteMiner':
                result = spawnNewRemoteMiner(parseInt(split[1]), spawn, roomID);
                break;
            case 'Reserver':
                result = spawnNewReserver(parseInt(split[1]), spawn, roomID);
                break;
            case 'RemoteCarrier':
                result = spawnNewRemoteCarrier(
                    parseInt(split[1]),
                    spawn,
                    roomID
                );
                break;
        }
    } else {
        result = ERR_BUSY;
    }
    return result;
}
export function mountSpawn() {
    assignPrototype(StructureSpawn, spawnExt);
}
