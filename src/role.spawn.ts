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
        if (Porter == 0) {
            available = 300;
        }
        if (miners < MinersNumber) {
            pushHarvester(available, spawn);
            spawn.memory['send'] = true;
        } else if (Porter < PorterNumber) {
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
                return v.split(' ')[0] == 'RemoteSource';
            }) &&
            remoteMiners <
                Object.keys(Game.flags).filter((v) => {
                    return v.split(' ')[0] == 'RemoteSource';
                }).length
        ) {
            pushRemoteMiner(available, spawn);
            spawn.memory['send'] = true;
        }
        if (
            Object.keys(Game.flags).find((v) => {
                return v.split(' ')[0] == 'RemoteSource';
            }) &&
            Reserver <
                Object.keys(Game.flags).filter((v) => {
                    return v.split(' ')[0] == 'RemoteSource';
                }).length &&
            spawn.room.energyAvailable > 300
        ) {
            pushReserver(available, spawn);
            spawn.memory['send'] = true;
        }
        if (remoteCarrier < 5 && spawn.room.storage) {
            pushRemoteCarrier(available, spawn.room.storage.id, spawn);
            spawn.memory['send'] = true;
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
function pushRemoteCarrier(i: Number, storage: String, spawn: StructureSpawn) {
    pushSpawnTask(`RemoteCarrier ${i} ${storage}`, spawn.name);
}

function pushHarvester(i: Number, spawn: StructureSpawn) {
    pushSpawnTask(`Harvester ${i}`, spawn.name);
}
function pushCarrier(i: Number, spawn: StructureSpawn) {
    pushSpawnTask(`Carrier ${i}`, spawn.name);
}
function pushBuilder(i: Number, spawn: StructureSpawn) {
    pushSpawnTask(`Builder ${i}`, spawn.name);
}
function pushUpgrader(i: Number, spawn: StructureSpawn) {
    pushSpawnTask(`Upgrader ${i}`, spawn.name);
}

function pushRemoteMiner(i: Number, spawn: StructureSpawn) {
    pushSpawnTask(`RemoteMiner ${i}`, spawn.name);
}
function pushReserver(i: Number, spawn: StructureSpawn) {
    pushSpawnTask(`Reserver ${i}`, spawn.name);
}
