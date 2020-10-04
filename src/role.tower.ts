const WHITE_LIST = [];

import { structure } from './base';
import { assignPrototype } from './util';
export default class tower extends StructureTower implements structure {
    public work(): void {
        this.check(this);
        switch (Memory['towerStat']) {
            case 'attack':
                this.less(this);
                break;
            case 'less':
                this.less(this);
                break;
            case 'normal':
            case undefined:
            default:
                this.normal(this);
                break;
        }
    }

    private find(tower: StructureTower) {
        return tower.room.find(FIND_HOSTILE_CREEPS, {
            filter: (creep) => {
                return !WHITE_LIST.includes(creep.owner.username);
            },
        });
    }

    private check(tower: StructureTower) {
        let creeps = this.find(tower);
        if (creeps.length == 0) {
            Memory['towerStat'] = 'normal';
        } else if (creeps.length > 5) {
            Memory['towerStat'] = 'attack';
        } else {
            Memory['towerStat'] = 'less';
        }
    }

    private normal(tower: StructureTower) {
        let hurtCreep = tower.room.find(FIND_MY_CREEPS, {
            filter: (creep) => {
                return creep.hitsMax - creep.hits > 0;
            },
        });

        if (hurtCreep.length > 0) {
            tower.heal(hurtCreep[0]);
        } 
    }

    private less(tower: StructureTower) {
        let attack = this.find(tower);
        tower.attack(attack[0]);
    }
}
export function mountTower() {
    assignPrototype(StructureTower, tower);
}
