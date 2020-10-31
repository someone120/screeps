import {
    getMinerFirstAvailableFlag,
    getReserverFirstAvailableFlag,
    getScoutFirstAvailableFlag,
    setMinerUnavailableFlag,
    setReserverUnavailableFlag,
    setScoutUnavailableFlag
} from 'flag';
import { pushCarrierTask, pushSpawnTask } from './task.manager';
const MinersNumber = 2;
const PorterNumber = 6;
const KeeperNumber = 4;
const HealerNumber = 4;
export default function() {
    let spawn = Game.spawns['Spawn1'];
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
        let miners = Memory['type'][0];
        let builder = Memory['type'][1];
        let Porter = Memory['type'][2];
        let Keeper = Memory['type'][3];
        let healer = Memory['type'][4];
        let remoteMiners = Memory['type'][5];
        let Reserver = Memory['type'][6];
        let remoteCarrier = Memory['type'][7];
        let energyTransfer = Memory['type'][8];
        let scout = Memory['type'][9];
        if (Porter == 0) {
            available = 300;
        }
        if (miners < MinersNumber) {
            pushHarvester(available, spawn);
            spawn.memory['send'] = true;
        }
        if (Porter < PorterNumber) {
            pushCarrier(available, spawn);
            spawn.memory['send'] = true;
        }
        if (builder + healer < HealerNumber) {
            pushBuilder(available, spawn);
            spawn.memory['send'] = true;
        }
        if (Keeper < KeeperNumber) {
            pushUpgrader(available, spawn);
            spawn.memory['send'] = true;
        }
        if (
            Object.keys(Game.flags).find((v) => {
                return v.split('_')[0] == 'RemoteSource';
            }) &&
            remoteMiners <
                Object.keys(Game.flags).filter((v) => {
                    return v.split('_')[0] == 'RemoteSource';
                }).length
        ) {
            let flag = getMinerFirstAvailableFlag();
            if (flag) {
                pushRemoteMiner(available, flag, spawn);
                spawn.memory['send'] = true;
                setMinerUnavailableFlag(flag);
            }
        }
        if (
            Object.keys(Game.flags).find((v) => {
                return v.split('_')[0] == 'RemoteSource';
            }) &&
            Reserver <
                Object.keys(Game.flags).filter((v) => {
                    return v.split('_')[0] == 'RemoteSource';
                }).length &&
            spawn.room.energyAvailable > 300
        ) {
            let flag = getReserverFirstAvailableFlag();
            if (flag) {
                pushReserver(available, flag, spawn);
                spawn.memory['send'] = true;
                setReserverUnavailableFlag(flag);
            }
        }
        if (remoteCarrier < 5 && spawn.room.storage) {
            pushRemoteCarrier(available, spawn.room.storage.id, spawn);
            spawn.memory['send'] = true;
        }
        if (energyTransfer < 1) {
            let task = `energyTransfer ${available}`;
            if (
                Memory['spawnTask'].includes(task) ||
                global['spawnTask'] == task
            ) {
                return;
            }
            console.log(
                `<p style="color: #8BC34A;">[${spawn.name}]发布了任务：${task}</p>`
            );
            Memory['spawnTask'].unshift(task);
        }
        if (scout < Object.keys(Game.flags).length) {
            let flag = getScoutFirstAvailableFlag();
            if (flag) {
                pushSpawnTask(`Scout ${available} ${flag}`,spawn.name);
                setScoutUnavailableFlag(flag);
            }
        }
    }
    if (spawn.room.energyCapacityAvailable - spawn.room.energyAvailable > 0) {
        pushCarrierTask(
            `carry ${spawn.room.storage ? spawn.room.storage.id : ''} ${
                spawn.name
            }`,
            spawn.name
        );
    }
}
function pushRemoteCarrier(i: Number, storage: string, spawn: StructureSpawn) {
    pushSpawnTask(`RemoteCarrier ${i} ${storage}`, spawn.name);
}
function pushHarvester(i: Number, spawn: StructureSpawn) {
    let task = `Harvester ${i}`;
    if (Memory['spawnTask'].includes(task) || global['spawnTask'] == task) {
        return;
    }
    console.log(
        `<p style="color: #8BC34A;">[${spawn.name}]发布了任务：${task}</p>`
    );
    Memory['spawnTask'].unshift(task);
}
function pushCarrier(i: Number, spawn: StructureSpawn) {
    let task = `Carrier ${i}`;
    if (Memory['spawnTask'].includes(task) || global['spawnTask'] == task) {
        return;
    }
    console.log(
        `<p style="color: #8BC34A;">[${spawn.name}]发布了任务：${task}</p>`
    );
    Memory['spawnTask'].unshift(task);
}
function pushBuilder(i: Number, spawn: StructureSpawn) {
    pushSpawnTask(`Builder ${i}`, spawn.name);
}
function pushUpgrader(i: Number, spawn: StructureSpawn) {
    pushSpawnTask(`Upgrader ${i}`, spawn.name);
}
function pushRemoteMiner(i: Number, flagName: string, spawn: StructureSpawn) {
    pushSpawnTask(`RemoteMiner ${i} ${flagName}`, spawn.name);
}
function pushReserver(i: Number, flagName: string, spawn: StructureSpawn) {
    pushSpawnTask(`Reserver ${i} ${flagName}`, spawn.name);
}
