import { bodySet } from './setting';

export default function() {
    if (!Memory['spawnTask']) {
        Memory['spawnTask'] = [];
    }
    if (!global['spawnTask']) {
        global['spawnTask'] = getTask(Memory['spawnTask']);
    }
    if (global['spawnTask']) {
        if (parseTask(global['spawnTask']) == OK) {
            global['spawnTask'] = null;
        }
    }
}

function spawnNewHarvester(i: Number, spawn: StructureSpawn): Number {
    let result = spawn.spawnCreep(
        bodySet.harvester[i + ''],
        `Miner@${Game.time}`,
        {
            memory: { type: 0 },
        }
    );
    if (result == OK) {
        spawn.memory['send'] = false;
    }
    if (result == ERR_NOT_ENOUGH_ENERGY) {
        result = OK;
    }
    return result;
}
function spawnNewBuilder(i: Number, spawn: StructureSpawn): Number {
    let result = spawn.spawnCreep(
        bodySet.builder[i + ''],
        `Builder@${Game.time}`,
        {
            memory: { type: 1 },
        }
    );
    if (result == OK) {
        spawn.memory['send'] = false;
    }
    if (result == ERR_NOT_ENOUGH_ENERGY) {
        result = OK;
    }
    return result;
}
function spawnNewCarrier(i: Number, spawn: StructureSpawn): Number {
    let result = spawn.spawnCreep(
        bodySet.carrier[i + ''],
        `Carrier@${Game.time}`,
        {
            memory: { type: 2 },
        }
    );
    if (result == OK) {
        spawn.memory['send'] = false;
    }
    if (result == ERR_NOT_ENOUGH_ENERGY) {
        result = OK;
    }
    return result;
}
function spawnNewReserver(i: Number, spawn: StructureSpawn): Number {
    let result = spawn.spawnCreep(
        bodySet.reserver[i + ''],
        `reserver@${Game.time}`,
        {
            memory: { type: 6 },
        }
    );
    if (result == OK) {
        spawn.memory['send'] = false;
    }
    if (result == ERR_NOT_ENOUGH_ENERGY) {
        result = OK;
    }
    return result;
}
function spawnNewRemoteMiner(i: Number, spawn: StructureSpawn): Number {
    let result = spawn.spawnCreep(
        bodySet.remoteMiner[i + ''],
        `RemoteMiner@${Game.time}`,
        {
            memory: { type: 5 },
        }
    );
    if (result == OK) {
        spawn.memory['send'] = false;
    }
    if (result == ERR_NOT_ENOUGH_ENERGY) {
        result = OK;
    }
    return result;
}
function spawnNewUpgrader(i: Number, spawn: StructureSpawn): Number {
    let result = spawn.spawnCreep(
        bodySet.upgrader[i + ''],
        `Upgrader@${Game.time}`,
        {
            memory: { type: 3 },
        }
    );
    if (result == OK) {
        spawn.memory['send'] = false;
    }
    if (result == ERR_NOT_ENOUGH_ENERGY) {
        result = OK;
    }
    return result;
}
function getTask(tasks: String[]): String {
    return tasks.shift();
}
function parseTask(tasks: String): Number {
    let result: Number;
    let split = tasks.split(' ');
    let spawn = Game.spawns[split[1]];
    if (!spawn.spawning) {
        switch (split[0]) {
            case 'Carrier':
                result = spawnNewCarrier(parseInt(split[2]), spawn);
                break;
            case 'Harvester':
                result = spawnNewHarvester(parseInt(split[2]), spawn);
                break;
            case 'Builder':
                result = spawnNewBuilder(parseInt(split[2]), spawn);
                break;
            case 'Upgrader':
                result = spawnNewUpgrader(parseInt(split[2]), spawn);
                break;
            case 'Repairer':
                result = spawnNewBuilder(parseInt(split[2]), spawn);
                break;
            case 'RemoteMiner':
                result = spawnNewRemoteMiner(parseInt(split[2]), spawn);
                break;
            case 'Reserver':
                result = spawnNewReserver(parseInt(split[2]), spawn);
                break;
        }
    } else {
        result = ERR_BUSY;
    }
    return result;
}
