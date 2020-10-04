import { mountTower } from './role.tower';

export default function () {
    if (!global['hasExtension']) {
        console.log('[mount] 重新挂载拓展')
        global['hasExtension'] = true
        
        mountTower();
    }
}
