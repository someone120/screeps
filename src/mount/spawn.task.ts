import { setMinerUnavailableFlag, setReserverUnavailableFlag } from 'flag';
import _ from 'lodash';
import { structure } from 'base';
import { bodyConfigs as bodySet } from 'setting';
import { assignPrototype, encodee as encode } from 'utils';
export default class spawnExt extends StructureSpawn implements structure {
    work() {
        let available = this.room.energyCapacityAvailable;
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
        if (!Memory.type) {
            Memory.type = {};
        }
        if (
            !Memory.type[this.room.name] ||
            Memory.type[this.room.name].length <= 0
        ) {
            Memory.type[this.room.name] = Array(12).fill(0);
        }
        if (!global['spawnEnd']) {
            global['spawnEnd'] = {};
        }
        if (!this.spawning) {
            this.memory['time'] = -1;
        }
        if (this.spawning) {
            if (!this.memory['time'] || this.memory['time'] == -1) {
                this.memory['time'] = this.spawning.needTime + Game.time + 5;
            }
            if (this.memory['time'] < Game.time) {
                Memory['destoryNext'] = this.spawning.name;
                this.spawning.setDirections([TOP]);
            }
        }
        if (!Memory.spawnTask[this.room.name]) {
            Memory.spawnTask[this.room.name] = [];
        }
        if (!global['spawnTask']) {
            global['spawnTask'] = {};
        }
        if (!global['spawnTask'][this.name]) {
            global['spawnTask'][this.name] = getTask(
                Memory.spawnTask[this.room.name]
            );
        } else {
            const type = global['spawnTask'][this.name].split(' ');
            if (
                ((Memory.type[this.room.name][0] <= 0 ||
                    Memory.type[this.room.name][2] <= 0) &&
                    parseInt(type[1]) > 300) ||
                parseInt(type[1]) > available ||
                type[0] == 'Reserver'
            ) {
                // 挺简单的，是吧？
                delete global['spawnTask'][this.name];

                global['spawnTask'][this.name] = getTask(
                    Memory.spawnTask[this.room.name]
                );
            }
            const result = parseTask(
                global['spawnTask'][this.name],
                this,
                this.room.name
            );
            if (result == OK) {
                delete global['spawnTask'][this.name];
            }
            this.room.visual.text(
                global['spawnTask'][this.name],
                this.pos.x,
                this.pos.y - 0.5,
                {
                    font: 0.3,
                    stroke: '#000000',
                    strokeWidth: 0.05
                }
            );
            if (this.spawning) {
                this.room.visual.text(
                    `${this.spawning.name} ${(
                        ((this.spawning.needTime -
                            this.spawning.remainingTime) /
                            this.spawning.needTime) *
                        100
                    ).toFixed(2)}%`,
                    this.pos.x + 0.5,
                    this.pos.y,
                    {
                        font: 0.3,
                        stroke: '#000000',
                        strokeWidth: 0.05,
                        align: 'left'
                    }
                );
            }
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
        bodySet.worker[i + ''],
        `Builder@${Game.time}`,
        {
            memory: { type: 4, roomID: roomID }
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
        bodySet.manager[i + ''],
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
        bodySet.remoteHarvester[i + ''],
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
        bodySet.manager[i + ''],
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
                    bodySet.manager[split[1]],
                    `energyTransfer@${Game.time}`,
                    {
                        memory: { type: 8, roomID: roomID },
                        directions: [BOTTOM]
                    }
                );
                break;
            case 'Scout':
                let d: {
                    pos: posExt;
                    remoteSource: boolean;
                    flagName?: string;
                };
                if (split[2]) {
                    d = JSON.parse(split[2]);
                }
                result = spawn.spawnCreep([MOVE], `Scout@${Game.time}`, {
                    memory: {
                        type: 9,
                        roomID: roomID,
                        pos: d.pos,
                        remoteSource: d.remoteSource,
                        flagName: d.flagName
                    }
                });
                break;
            case 'Mineraler':
                result = spawn.spawnCreep(
                    bodySet.worker[split[1]],
                    `Mineraler@${Game.time}`,
                    {
                        memory: { type: 10, roomID: roomID }
                    }
                );
                break;
            case 'WallPainter':
                result = spawn.spawnCreep(
                    bodySet.worker[split[1]],
                    `WallPainter@${Game.time}`,
                    {
                        memory: { type: 11, roomID: roomID }
                    }
                );
                break;
            case 'Protector':
                result = spawn.spawnCreep(
                    bodySet.attacker[split[1]],
                    `Protector@${Game.time}`,
                    {
                        memory: {
                            type: 12,
                            roomID: roomID,
                            protectRoomId: split[2]
                        }
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
