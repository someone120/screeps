import roleSpawn from 'mount/roles/role.spawn';
import { creepExt } from 'base';
import { ErrorMapper } from 'errorMapping';
import mount from 'mount/roles/mount';
import { argCpu, stateScanner } from 'utils';
import { Visualizer } from 'Visualizer';
import { roles } from 'classes';
import _ from 'lodash';
import { memory } from 'console';
const saying = 'Open the skylight and speak brightly.'.split(' ');
module.exports.loop = ErrorMapper.wrapLoop(() => {
    loop();
});

function loop() {
    Memory.type = {};
    Memory.lockSource = [];
    Memory.ScoutRemoteSource = [];
    Memory.ReserverRemoteSource = [];
    Memory.MinerRemoteSource = [];
    global.porterTasksTaken = [];
    if (!Memory.argCpu) {
        Memory.argCpu = { argCpu: 0, ticks: 0 };
    }
    mount();
    for (let name in Game.creeps) {
        // console.log(name);

        let creep = Game.creeps[name];
        if (creep.spawning) {
            continue;
        }
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
        if (creep.memory.sourceID) {
            Memory.lockSource.push(creep.memory.sourceID);
        }
        if (creep.memory.parentTaskRaw) {
            global.porterTasksTaken.push(creep.memory.parentTaskRaw);
        }
        if (
            Game.cpu.bucket < Memory.argCpu.argCpu &&
            Game.time % 2 == 1 &&
            !_.map(creep.body, 'type').includes(CLAIM) &&
            creep.body.length < 5
        ) {
            creep.say('🛏️');
            continue;
        }
        if (
            Game.cpu.bucket < Memory.argCpu.argCpu &&
            Game.time % 2 == 0 &&
            !_.map(creep.body, 'type').includes(CLAIM) &&
            creep.body.length > 5
        ) {
            creep.say('🛏️');
            continue;
        }
        if (Memory['destoryNext'] && Memory['destoryNext'] == name) {
            creep.suicide();
            delete Memory['destoryNext'];
            continue;
        }
        if (creep.memory.type == -1) {
            continue;
        }
        if (creep.memory.type == -2) {
            creep.say(saying[Game.time % saying.length], true);

            continue;
        }
        let t: creepExt | null = roles[creep.memory.type]
            ? new roles[creep.memory.type]!(creep.id)
            : null;

        if (t) {
            ErrorMapper.wrapLoop(() =>  {
                t!.work();
                drawType(creep);
            } )()
        }
        autoClean();
        Object.values(Game.structures).forEach((v) => {
            if (v.work) {
                v.work();
            }
            if (v.structureType == STRUCTURE_SPAWN) {
                roleSpawn(v as StructureSpawn);
            }
        });
        if (
            Game.cpu.bucket == 10000 &&
            !Object.values(Memory['towerStat']).find((it) => {
                it != 'normal';
            })
        ) {
            Game.cpu.generatePixel();
        }
        // let path=PathFinder.search(RoomPosition(4,17, 'W33N42'),{pos:RoomPosition(21,26, 'W33N42'),range:1})
        // console.log(JSON.stringify(path));
        Visualizer.visuals();
        stateScanner();

        Memory.argCpu = argCpu(Memory.argCpu, Game.cpu.getUsed());
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
        let text = roles[creep.memory.type]!.name || '我也不懂';
        creep.room.visual.text(text, creep.pos.x, creep.pos.y + 0.5, {
            color: '#2196F3',
            font: 0.3,
            stroke: '#000000',
            strokeWidth: 0.05
        });
    }
}