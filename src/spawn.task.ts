import { setMinerUnavailableFlag, setReserverUnavailableFlag } from 'flag';
import _ from 'lodash';
import { structure } from './base';
import { bodySet } from './setting';
import { assignPrototype, encodee as encode } from './util';
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
                parseInt(global['spawnTask'].split(' ')[1]) > 300 &&
                Memory['type'][2] <= 0
            ) {
                Memory['spawnTask'].push(global['spawnTask']);
                global['spawnTask'] = null;
                return;
            }
            const result = parseTask(global['spawnTask'], this, this.room.name);
            if (result == OK) {
                global['spawnTask'] = null;
            }
            this.room.visual.text(
                global['spawnTask'],
                this.pos.x,
                this.pos.y - 0.5,
                {
                    color: '#2196F3',
                    font: 0.3,
                    stroke: '#000000',
                    strokeWidth: 0.05
                }
            );
        }
    }
    // spawnCreep(
    //     body: BodyPartConstant[],
    //     name: string,
    //     opts?: SpawnOptions
    // ): ScreepsReturnCode {
    //     name = encode(name);
    //     let _spawnCreep = this.spawnCreep;
    //     return _spawnCreep(body, name, opts);
    // }
}
function spawnNewHarvester(
    i: Number,
    spawn: StructureSpawn,
    roomID: string
): Number {
    let result = spawn.spawnCreep(
        bodySet.harvester[i + ''],
        `Miner@${Game.time}`,
        {
            memory: { type: 0, roomID: roomID }
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
    roomID: string
): Number {
    let result = spawn.spawnCreep(
        bodySet.builder[i + ''],
        `Builder@${Game.time}`,
        {
            memory: { type: 1, roomID: roomID }
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
    roomID: string
): Number {
    let result = spawn.spawnCreep(
        bodySet.carrier[i + ''],
        `Carrier@${Game.time}`,
        {
            memory: { type: 2, roomID: roomID }
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
    roomID: string,
    flagName: string
): Number {
    let result = spawn.spawnCreep(
        bodySet.reserver[i + ''],
        `reserver@${Game.time}`,
        {
            memory: { type: 6, roomID: roomID, flagName: flagName }
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
    roomID: string,
    flagName: string
): Number {
    let result = spawn.spawnCreep(
        bodySet.remoteMiner[i + ''],
        `RemoteMiner@${Game.time}`,
        {
            memory: { type: 5, roomID: roomID, flagName: flagName }
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
    roomID: string
): Number {
    let result = spawn.spawnCreep(
        bodySet.carrier[i + ''],
        `RemoteCarrier@${Game.time}`,
        {
            memory: { type: 7, roomID: roomID }
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
    roomID: string
): Number {
    let result = spawn.spawnCreep(
        bodySet.upgrader[i + ''],
        `Upgrader@${Game.time}`,
        {
            memory: { type: 3, roomID: roomID }
        }
    );
    if (result == OK) {
        spawn.memory['send'] = false;
    }
    return result;
}
function getTask(tasks: string[]): string {
    return tasks.shift();
}
function parseTask(tasks: string, spawn: StructureSpawn, roomID): Number {
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
                result = spawnNewRemoteMiner(
                    parseInt(split[1]),
                    spawn,
                    roomID,
                    split[2]
                );
                break;
            case 'Reserver':
                result = spawnNewReserver(
                    parseInt(split[1]),
                    spawn,
                    roomID,
                    split[2]
                );
                break;
            case 'RemoteCarrier':
                result = spawnNewRemoteCarrier(
                    parseInt(split[1]),
                    spawn,
                    roomID
                );
                break;
            case 'energyTransfer':
                result = spawn.spawnCreep(
                    bodySet.carrier[split[1]],
                    `energyTransfer@${Game.time}`,
                    {
                        memory: { type: 8, roomID: roomID }
                    }
                );
                break;
            case 'Scout':
                result = spawn.spawnCreep(
                    [TOUGH, MOVE],
                    `Scout@${Game.time} ${split[2]}`,
                    {
                        memory: { type: 9, roomID: roomID, flagName: split[2] }
                    }
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
