import roleSpawn from 'mount/role.spawn';
import { creepExt } from 'base';
import { ErrorMapper } from 'errorMapping';
import mount from 'mount/mount';
import { stateScanner } from 'utils';
import { Visualizer } from 'Visualizer';
import { roles } from 'classes';

module.exports.loop = ErrorMapper.wrapLoop(() => {
    loop();
});

export function checkQuantity(creeps: { [creepName: string]: Creep }) {
    if (Game.time % 10 != 0) {
        return;
    }
    Memory.type = {};
    Memory.ScoutRemoteSource = [];
    Memory.ReserverRemoteSource = [];
    Memory.MinerRemoteSource = [];
    Object.values(creeps).forEach((creep) => {
        if (
            !Memory.type[creep.memory.roomID] ||
            Memory.type[creep.memory.roomID].length <= 0
        ) {
            Memory.type[creep.memory.roomID] = Array(roles.length).fill(0);
        }
        Memory.type[creep.memory.roomID][creep.memory.type]++;
        if (creep.memory.flagName) {
            switch (creep.memory.type) {
                case 5:
                    Memory.MinerRemoteSource.push(creep.memory.flagName);
                    break;
                case 6:
                    Memory.ReserverRemoteSource.push(creep.memory.flagName);
                    break;
                case 9:
                    Memory.ScoutRemoteSource.push(creep.memory.flagName);
                    break;
                default:
                    break;
            }
        }
    });
}
function loop() {
    mount();
    roleSpawn();
    checkQuantity(Game.creeps);
    for (let name in Game.creeps) {
        // console.log(name);
        let creep = Game.creeps[name];
        if (Memory['destoryNext'] && Memory['destoryNext'] == name) {
            creep.suicide();
            Memory['destoryNext'] = null;
            continue;
        }
        if (creep.memory.type == -1) {
            continue;
        }
        let t: creepExt = new roles[creep.memory.type](creep.id);
        drawType(creep);
        if (t) t.work();
    }
    autoClean();
    Object.values(Game.structures).forEach((v) => {
        if (v.work) {
            if (v.structureType == STRUCTURE_CONTAINER) console.log(v.id);

            v.work();
        }
    });
    if (Game.cpu.bucket >= 9000 && Memory['towerStat'] == 'normal') {
        Game.cpu.generatePixel();
    }
    // let path=PathFinder.search(RoomPosition(4,17, 'W33N42'),{pos:RoomPosition(21,26, 'W33N42'),range:1})
    // console.log(JSON.stringify(path));
    Visualizer.visuals();
    stateScanner();
    if (Game.time % 10000 == 0) {
        Game.cpu.halt();
    }
}

/**
 * 自动清理死亡的creep内存
 */
function autoClean() {
    if (Game.time % 20 != 0) {
        return;
    }
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }

        for (const flagName in Memory.flags) {
            if (!Game.flags[flagName]) {
                delete Memory.flags[flagName];
            }
        }
    }
}
function drawType(creep: Creep) {
    let text = roles[creep.memory.type].name || '我也不懂';
    creep.room.visual.text(text, creep.pos.x, creep.pos.y + 0.5, {
        color: '#2196F3',
        font: 0.3,
        stroke: '#000000',
        strokeWidth: 0.05
    });
}
