import { creep } from './base';
import { Upgrader } from './controller.keeper';
import mount from './mount';
import { builder } from './role.builder';
import { harvester } from './role.harvester';
import { Repairer } from './role.maintainer';
import { Carrier } from './role.porter';
var creepsCount: { run: () => void } = require('creep.spawn');


module.exports.loop = function() {
    mount()
    Memory['type'] = [0, 0, 0, 0, 0];
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        let t: creep;
        drawType(creep);
        switch (creep.memory['type']) {
            case 0:
                t = new harvester(creep.id);
                Memory['type'][0]++;
                break;
            case 1:
                t = new builder(creep.id);
                Memory['type'][1]++;
                break;
            case 2:
                t = new Carrier(creep.id);
                Memory['type'][2]++;
                break;
            case 3:
                t = new Upgrader(creep.id);
                Memory['type'][3]++;
                break;
            case 4:
                t = new Repairer(creep.id);
                Memory['type'][4]++;
                break;
            case undefined:
            default:
                creep.say('我自裁吧');
                creep.suicide();
                break;
        }
        t.work();
    }
    creepsCount.run();
    autoClean();
    Object.values(Game.structures).forEach((v) => {
        if (v.work!=undefined) {
            v.work();
        }
    });
    // let path=PathFinder.search(RoomPosition(4,17, 'W33N42'),{pos:RoomPosition(21,26, 'W33N42'),range:1})
    // console.log(JSON.stringify(path));
};

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
    }
    creep.room.visual.text(text, creep.pos.x, creep.pos.y + 0.5, {
        color: '#2196F3',
        font: 0.3,
        stroke: '#000000',
        strokeWidth: 0.05,
    });
}
