/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * let mod = require('creep.spawn');
 * mod.thing == 'a thing'; // true
 */
const MinersNumber = 2;
const PorterNumber = 5;
const KeeperNumber = 8;
const HealerNumber = 8;
function spawnNewMiner(i: Number, spawn: StructureSpawn) {
    if (spawn.room.energyAvailable >= 550 || Memory['type'][2] >= 0) {
        spawn.spawnCreep([WORK, WORK, WORK, WORK, WORK, CARRY], `Worker@${i}`, {
            memory: { type: 0 },
        });
    } else {
        spawn.spawnCreep([WORK, WORK, CARRY, MOVE], `Worker@${i}`, {
            memory: { type: 0 },
        });
    }
}

function spawnNewBuilder(i: Number, spawn: StructureSpawn) {
    if (spawn.room.energyAvailable >= 550 || Memory['type'][2] >= 0) {
        spawn.spawnCreep(
            [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE],
            `Builder@${i}`,
            { memory: { type: 1 } }
        );
    } else {
        spawn.spawnCreep([WORK, CARRY, MOVE], `Builder@${i}`, {
            memory: { type: 1 },
        });
    }
}

function spawnNewPorter(i: Number, spawn: StructureSpawn) {
    if (spawn.room.energyAvailable >= 550 || Memory['type'][2] >= 0) {
        spawn.spawnCreep(
            [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
            `Porter@${i}`,
            { memory: { type: 2 } }
        );
    } else {
        spawn.spawnCreep([CARRY, MOVE], `Porter@${i}`, { memory: { type: 2 } });
    }
}

function spawnNewKeeper(i: Number, spawn: StructureSpawn) {
    if (spawn.room.energyAvailable >= 550 || Memory['type'][2] >= 0) {
        spawn.spawnCreep(
            [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE],
            `Keeper@${i}`,
            { memory: { type: 3 } }
        );
    } else {
        spawn.spawnCreep([WORK, CARRY, MOVE], `Keeper@${i}`, {
            memory: { type: 3 },
        });
    }
}

var creepsCount = {
    run: function() {
        let miners = Memory['type'][0];
        let builder = Memory['type'][1];
        let Porter = Memory['type'][2];
        let Keeper = Memory['type'][3];
        let healer = Memory['type'][4];
        if (miners < MinersNumber) {
            spawnNewMiner(Game.time, Game.spawns['Spawn1']);
        } else if (Porter < PorterNumber) {
            spawnNewPorter(Game.time, Game.spawns['Spawn1']);
        } else if (Keeper < KeeperNumber) {
            spawnNewKeeper(Game.time, Game.spawns['Spawn1']);
        } else if (builder + healer < HealerNumber) {
            spawnNewBuilder(Game.time, Game.spawns['Spawn1']);
        }
    },
};

module.exports = creepsCount;
