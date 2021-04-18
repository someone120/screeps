import { structure } from 'ScreepsBase';
import { bodyConfigs as bodySet } from 'setting';
import { pushCarrierTask } from 'mount/tasks/task.manager';
import { assignPrototype } from 'utils';
export default class spawnExt extends StructureSpawn implements structure {
    work() {
        if (this.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            pushCarrierTask(
                `request/${this.id}/${RESOURCE_ENERGY}`,
                this.room.name,
                this.id
            );
        }

        let available = (Memory.type[this.room.name][2] == 0 || Memory.type[this.room.name][0] == 0) ? this.room.energyAvailable : this.room.energyCapacityAvailable;
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
        } else  {
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
        if (!this.spawning) {
            this.memory.time = -1;
        }
        if (this.spawning) {
            if (!this.memory.time || this.memory.time == -1) {
                this.memory.time = this.spawning.needTime + Game.time + 5;
            }
            if (this.memory.time < Game.time) {
                this.spawning.cancel();
            }
        }
        if (!Memory.spawnTask) {
            Memory.spawnTask = {};
        }
        if (!Memory.spawnTask[this.room.name]) {
            Memory.spawnTask[this.room.name] = [];
        }
        if (!global.spawnTask) {
            global.spawnTask = {};
        }
        if (!global.spawnTask[this.name]) {
            const newLocal = getTask(Memory.spawnTask[this.room.name]);
            global.spawnTask[this.name] = newLocal;
        } else {
            const type = global.spawnTask[this.name]!.split(' ');
            if (
                ((Memory.type[this.room.name][0] <= 0 ||
                    Memory.type[this.room.name][2] <= 0) &&
                    parseInt(type[1]) > available) ||
                parseInt(type[1]) > available ||
                (type[0] == 'Reserver' && parseInt(type[1]) <= 550)
            ) {
                // 挺简单的，是吧？
                delete global.spawnTask[this.name];

                global.spawnTask[this.name] = getTask(
                    Memory.spawnTask[this.room.name]
                );
            }
            const result = parseTask(
                global.spawnTask[this.name]!,
                this,
                this.room.name
            );
            if (result == OK) {
                delete global.spawnTask[this.name];
            }
            this.room.visual.text(
                global.spawnTask[this.name]!,
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
    roomID: string,
    sourceID: string
): Number {
    let result = spawn.spawnCreep(
        bodySet.harvester[
            i as 300 | 550 | 800 | 1300 | 1800 | 2300 | 5600 | 10000
        ],
        `Miner@${Game.time}`,
        {
            memory: { type: 0, roomID: roomID, sourceID: sourceID }
        }
    );

    console.log(`[SPAWN]采集者 Miner@${Game.time} 对应矿点 ${sourceID}`);
    spawn.room.lockSource(sourceID as Id<Source>);

    return result;
}
function spawnNewBuilder(
    i: Number,
    spawn: StructureSpawn,
    roomID: string
): Number {
    let result = spawn.spawnCreep(
        bodySet.worker[
            i as 300 | 550 | 800 | 1300 | 1800 | 2300 | 5600 | 10000
        ],
        `Builder@${Game.time}`,
        {
            memory: { type: 4, roomID: roomID }
        }
    );
    return result;
}


function spawnNewWorker(
    i: Number,
    spawn: StructureSpawn,
    roomID: string
): Number {
    let result = spawn.spawnCreep(
        bodySet.worker[
            i as 300 | 550 | 800 | 1300 | 1800 | 2300 | 5600 | 10000
        ],
        `Worker@${Game.time}`,
        {
            memory: { type: -3, roomID: roomID }
        }
    );
    return result;
}

function spawnNewCarrier(
    i: Number,
    spawn: StructureSpawn,
    roomID: string
): Number {
    let result = spawn.spawnCreep(
        bodySet.manager[
            i as 300 | 550 | 800 | 1300 | 1800 | 2300 | 5600 | 10000
        ],
        `Carrier@${Game.time}`,
        {
            memory: { type: 2, roomID: roomID }
        }
    );
    return result;
}
function spawnNewReserver(
    i: Number,
    spawn: StructureSpawn,
    roomID: string,
    flagName: string
): Number {
    let result = spawn.spawnCreep(
        bodySet.reserver[
            i as 300 | 550 | 800 | 1300 | 1800 | 2300 | 5600 | 10000
        ],
        `reserver@${Game.time}`,
        {
            memory: { type: 6, roomID: roomID, flagName: flagName }
        }
    );
    return result;
}
function spawnNewRemoteMiner(
    i: Number,
    spawn: StructureSpawn,
    roomID: string,
    flagName: string
): Number {
    let result = spawn.spawnCreep(
        bodySet.remoteHarvester[
            i as 300 | 550 | 800 | 1300 | 1800 | 2300 | 5600 | 10000
        ],
        `RemoteMiner@${Game.time}`,
        {
            memory: { type: 5, roomID: roomID, flagName: flagName }
        }
    );
    return result;
}
function spawnNewRemoteCarrier(
    i: Number,
    spawn: StructureSpawn,
    roomID: string
): Number {
    let result = spawn.spawnCreep(
        bodySet.manager[
            i as 300 | 550 | 800 | 1300 | 1800 | 2300 | 5600 | 10000
        ],
        `RemoteCarrier@${Game.time}`,
        {
            memory: { type: 7, roomID: roomID }
        }
    );
    return result;
}
function spawnNewUpgrader(
    i: Number,
    spawn: StructureSpawn,
    roomID: string
): Number {
    let result = spawn.spawnCreep(
        bodySet.upgrader[
            i as 300 | 550 | 800 | 1300 | 1800 | 2300 | 5600 | 10000
        ],
        `Upgrader@${Game.time}`,
        {
            memory: { type: 3, roomID: roomID }
        }
    );
    return result;
}
function getTask(tasks: string[]): string | undefined {
    return tasks.shift();
}
function parseTask(
    tasks: string,
    spawn: StructureSpawn,
    roomID: string
): Number {
    let result: Number | undefined;
    let split = tasks.split(' ');
    if (!spawn.spawning) {
        switch (split[0]) {
            case 'Carrier':
                result = spawnNewCarrier(parseInt(split[1]), spawn, roomID);
                break;
            case 'Harvester':
                result = spawnNewHarvester(
                    parseInt(split[1]),
                    spawn,
                    roomID,
                    split[2]
                );
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
                    bodySet.manager[
                        parseInt(split[1]) as
                            | 300
                            | 550
                            | 800
                            | 1300
                            | 1800
                            | 2300
                            | 5600
                            | 10000
                    ],
                    `energyTransfer@${Game.time}`,
                    {
                        memory: { type: 8, roomID: roomID }
                    }
                );
                break;
            case 'Mineraler':
                result = spawn.spawnCreep(
                    bodySet.worker[
                        parseInt(split[1]) as
                            | 300
                            | 550
                            | 800
                            | 1300
                            | 1800
                            | 2300
                            | 5600
                            | 10000
                    ],
                    `Mineraler@${Game.time}`,
                    {
                        memory: { type: 10, roomID: roomID }
                    }
                );
                break;
            case 'WallPainter':
                result = spawn.spawnCreep(
                    bodySet.worker[
                        parseInt(split[1]) as
                            | 300
                            | 550
                            | 800
                            | 1300
                            | 1800
                            | 2300
                            | 5600
                            | 10000
                    ],
                    `WallPainter@${Game.time}`,
                    {
                        memory: { type: 11, roomID: roomID }
                    }
                );
                break;
            case 'Protector':
                result = spawn.spawnCreep(
                    bodySet.attacker[
                        parseInt(split[1]) as
                            | 300
                            | 550
                            | 800
                            | 1300
                            | 1800
                            | 2300
                            | 5600
                            | 10000
                    ],
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
            case 'Worker':
                result= spawnNewWorker(parseInt(split[1]), spawn, roomID)
                break;

        }
    } else {
        result = ERR_BUSY;
    }
    return result || OK;
}
export function mountSpawn() {
    assignPrototype(StructureSpawn, spawnExt);
}
