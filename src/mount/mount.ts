import globalObj from './globalObj';
import _ from 'lodash';
import { mountLink } from './role.link';
import { mountSpawn } from './spawn.task';
import { mountExtension } from './role.ext';
import { mountTower } from 'role.tower';
import { mountSource } from './cache/room/source';
import { mountMove } from './move';
import { mountRoom } from './room';
import { mountContainer } from './role.container';
import roomPos from './roomPos';
export default function() {
    if (!global['hasExtension']) {
        console.log('[mount] 重新挂载拓展');
        global['hasExtension'] = true;
        mountRoom();
        mountMove();
        mountTower();
        mountSpawn();
        roomPos()
        mountExtension();
        mountLink();
        mountSource();
        mountContainer();
        _.assign(global, globalObj);
        if (!global['porterTasksTaken']) global['porterTasksTaken'] = [];
    }
}
