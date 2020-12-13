import {
    getMinerFirstAvailableFlag,
    getReserverFirstAvailableFlag,
    getScoutFirstAvailableFlag,
    setMinerUnavailableFlag,
    setReserverUnavailableFlag,
    setScoutUnavailableFlag
} from 'flag';
import { pushCarrierTask, pushSpawnTask } from '../task.manager';
import { getSourceFlags, requestEnergy } from 'utils';
import { lockRoom, roomStat } from './cache/room/protect';
const PorterNumber = 4;
const KeeperNumber = 4;
/**
 * 按照creep数量发送生成任务
 */
export default function() {
    for (const i in Game.spawns) {
        if (Object.prototype.hasOwnProperty.call(Game.spawns, i)) {
            const spawn = Game.spawns[i];
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
                const miners = Memory.type[spawn.room.name][0];
                const builder = Memory.type[spawn.room.name][1];
                const Porter = Memory.type[spawn.room.name][2];
                const Keeper = Memory.type[spawn.room.name][3];
                const healer = Memory.type[spawn.room.name][4];
                const remoteMiners = Memory.type[spawn.room.name][5];
                const Reserver = Memory.type[spawn.room.name][6];
                const remoteCarrier = Memory.type[spawn.room.name][7];
                const energyTransfer = Memory.type[spawn.room.name][8];
                const scout = Memory.type[spawn.room.name][9];
                const MineralCreep = Memory.type[spawn.room.name][10];
                const wallPainter = Memory.type[spawn.room.name][11];
                const Protectors = Memory.type[spawn.room.name][12];

                if (Porter == 0 || miners == 0) {
                    available = 300;
                }

                if (miners < spawn.room.sources.length) {
                    pushHarvester(available, spawn);
                    spawn.memory['send'] = true;
                }
                if (Porter < PorterNumber) {
                    pushCarrier(available, spawn);
                    spawn.memory['send'] = true;
                }
                if (builder < 2) {
                    pushBuilder(available, spawn);
                    spawn.memory['send'] = true;
                }
                if (healer < 2) {
                    pushRepairer(available, spawn);
                    spawn.memory['send'] = true;
                }
                if (Keeper < KeeperNumber) {
                    pushUpgrader(available, spawn);
                    spawn.memory['send'] = true;
                }
                if (energyTransfer < 1 && spawn.room.controller.level >= 6) {
                    let task = `energyTransfer ${available}`;
                    if (!Memory.spawnTask[spawn.room.name]) {
                        Memory.spawnTask[spawn.room.name] = [];
                    }
                    if (!global['spawnTask']) {
                        global['spawnTask'] = {};
                    }
                    if (
                        !(
                            Memory.spawnTask[spawn.room.name].includes(task) ||
                            global.spawnTask[spawn.room.name] == task
                        )
                    ) {
                        console.log(
                            `<p style="color: #8BC34A;">[${spawn.room.name}]发布了任务：${task}</p>`
                        );
                        Memory.spawnTask[spawn.room.name].unshift(task);
                    }
                }
                if (
                    getSourceFlags() &&
                    remoteMiners < getSourceFlags().length
                ) {
                    let flag = getMinerFirstAvailableFlag();
                    if (flag) {
                        pushRemoteMiner(available, flag, spawn);
                        spawn.memory['send'] = true;
                        setMinerUnavailableFlag(flag);
                    }
                }
                if (wallPainter < 3) {
                    pushSpawnTask(`WallPainter ${available}`, spawn.room.name);
                }
                if (
                    getSourceFlags() &&
                    Reserver < getSourceFlags().length &&
                    spawn.room.energyAvailable > 600
                ) {
                    let flag = getReserverFirstAvailableFlag();
                    if (flag) {
                        pushReserver(available, flag, spawn);
                        spawn.memory['send'] = true;
                        setReserverUnavailableFlag(flag);
                    }
                }
                if (
                    remoteCarrier < getSourceFlags().length * 3 &&
                    spawn.room.storage
                ) {
                    pushRemoteCarrier(available, spawn.room.storage.id, spawn);
                    spawn.memory['send'] = true;
                }

                // if (scout < Object.keys(Game.flags).length) {
                //     let d: {
                //         remoteSource: boolean;
                //     } = {
                //         remoteSource: false
                //     };
                //     pushSpawnTask(
                //         `Scout ${available} ${JSON.stringify(d)
                //             .replace(' ', '')
                //             .replace(/\n/g, '')}`,
                //         spawn.room.name
                //     );
                // }
                if (spawn.room.controller.level >= 6 && MineralCreep < 1) {
                    pushSpawnTask(`Mineraler ${available}`, spawn.room.name);
                }
                if (getSourceFlags() && Protectors < getSourceFlags().length) {
                    getSourceFlags().forEach((it) => {
                        if (it.room && !roomStat(it.room.name)) {
                            pushSpawnTask(
                                `Protector ${available} ${it.room.name}`,
                                spawn.room.name
                            );
                            lockRoom(it.room.name);
                        }
                    });
                }
            }
            if (
                spawn.room.energyCapacityAvailable -
                    spawn.room.energyAvailable >
                0
            ) {
                requestEnergy(
                    spawn.room.storage ? spawn.room.storage.id : '',
                    spawn.id
                );
            }
        }
    }
}
function pushRemoteCarrier(i: Number, storage: string, spawn: StructureSpawn) {
    pushSpawnTask(`RemoteCarrier ${i} ${storage}`, spawn.room.name);
}
function pushHarvester(i: Number, spawn: StructureSpawn) {
    if (!Memory.spawnTask) {
        Memory.spawnTask = {};
    }
    if (!Memory.spawnTask[spawn.room.name]) {
        Memory.spawnTask[spawn.room.name] = [];
    }
    if (!global['spawnTask']) {
        global['spawnTask'] = {};
    }
    let task = `Harvester ${i}`;
    if (
        Memory.spawnTask[spawn.room.name].includes(task) ||
        global.spawnTask[spawn.room.name] == task
    ) {
        return;
    }
    console.log(
        `<p style="color: #8BC34A;">[${spawn.room.name}]发布了任务：${task}</p>`
    );
    Memory.spawnTask[spawn.room.name].unshift(task);
}
function pushCarrier(i: Number, spawn: StructureSpawn) {
    if (!Memory.spawnTask) {
        Memory.spawnTask = {};
    }
    if (!Memory.spawnTask[spawn.room.name]) {
        Memory.spawnTask[spawn.room.name] = [];
    }
    if (!global['spawnTask']) {
        global['spawnTask'] = {};
    }
    let task = `Carrier ${i}`;
    if (
        Memory.spawnTask[spawn.room.name].includes(task) ||
        global.spawnTask[spawn.room.name] == task
    ) {
        return;
    }
    console.log(
        `<p style="color: #8BC34A;">[${spawn.room.name}]发布了任务：${task}</p>`
    );
    Memory.spawnTask[spawn.room.name].unshift(task);
}
function pushRepairer(i: Number, spawn: StructureSpawn) {
    pushSpawnTask(`Repairer ${i}`, spawn.room.name);
}
function pushBuilder(i: Number, spawn: StructureSpawn) {
    pushSpawnTask(`Builder ${i}`, spawn.room.name);
}
function pushUpgrader(i: Number, spawn: StructureSpawn) {
    pushSpawnTask(`Upgrader ${i}`, spawn.room.name);
}
function pushRemoteMiner(i: Number, flagName: string, spawn: StructureSpawn) {
    pushSpawnTask(`RemoteMiner ${i} ${flagName}`, spawn.room.name);
}
function pushReserver(i: Number, flagName: string, spawn: StructureSpawn) {
    pushSpawnTask(`Reserver ${i} ${flagName}`, spawn.room.name);
}
