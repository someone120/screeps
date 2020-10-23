import roleSpawn from 'role.spawn';
import { creep } from './base';
import { Upgrader } from './controller.keeper';
import { ErrorMapper } from './errorMapping';
import mount from './mount';
import { RemoteCarrier } from './remoteCarrier';
import { remoteMiner } from './remoteMiner';
import { reserve } from './reserver';
import { builder } from './role.builder';
import { harvester } from './role.harvester';
import { Repairer } from './role.maintainer';
import { Carrier } from './role.porter';
import { checkQuantity, stateScanner } from './util';
import { Visualizer } from './Visualizer';
module.exports.loop = ErrorMapper.wrapLoop(() => {
    mount();
    checkQuantity(Game.creeps);
    if (!Memory['type']) Memory['type'] = [0, 0, 0, 0, 0];
    if (!global['porterTasksTaken']) global['porterTasksTaken'] = [];
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        let t: creep;
        drawType(creep);
        switch (creep.memory['type']) {
            case 0:
                t = new harvester(creep.id);
                break;
            case 1:
                t = new builder(creep.id);
                break;
            case 2:
                t = new Carrier(creep.id);
                break;
            case 3:
                t = new Upgrader(creep.id);
                break;
            case 4:
                t = new Repairer(creep.id);
                break;
            case 5:
                t = new remoteMiner(creep.id);
                break;
            case 6:
                t = new reserve(creep.id);
                break;
            case 7:
                t = new RemoteCarrier(creep.id);
                break;
            case -1:
                break;
            //falls through
            case undefined:
            default:
                creep.say('我自裁吧');
                creep.suicide();
                break;
        }
        if (t) t.work();
    }
    autoClean();
    Object.values(Game.structures).forEach((v) => {
        if (v.work) {
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
    roleSpawn();
});

function autoClean() {
    if (Game.time % 20 != 0) {
        return;
    }
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
}

function drawType(creep: Creep) {
    let text = '';
    switch (creep.memory['type']) {
        case 0:
            text = 'Miner';
            break;
        case 1:
            text = 'Builder';
            break;
        case 2:
            text = 'Carrier';
            break;
        case 3:
            text = 'Upgrader';
            break;
        case 4:
            text = 'Repairer';
            break;
        case 5:
            text = 'remoteMiner';
            break;
        case 6:
            text = 'reserve';
            break;
        case 7:
            text = 'RemoteCarrier';
            break;
        default:
            text = '我也不懂';
            break;
    }
    creep.room.visual.text(text, creep.pos.x, creep.pos.y + 0.5, {
        color: '#2196F3',
        font: 0.3,
        stroke: '#000000',
        strokeWidth: 0.05,
    });
}
