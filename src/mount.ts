import globalObj from 'globalObj';
import _ from 'lodash';
import { mountSpawn } from 'spawn.task';
import { mountExtension } from './role.ext';
import { mountStorage } from './role.storage';
import { mountTower } from './role.tower';

export default function() {
    if (!global['hasExtension']) {
        console.log('[mount] 重新挂载拓展');
        global['hasExtension'] = true;

        mountTower();
        mountSpawn();
        mountExtension();
        mountStorage();
        _.assign(global, globalObj)
    }
}
