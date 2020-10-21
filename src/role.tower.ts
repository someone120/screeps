const WHITE_LIST = [];

import { structure } from './base';
import { assignPrototype, requestEnergy } from './util';
export default class towerExt extends StructureTower implements structure {
    public work(): void {
        this.check(this);
        switch (Memory['towerStat']) {
            case 'more':
                this.less(this);
                break;
            case 'less':
                this.less(this);
                break;
            //falls through
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
        if (Game.time % 5 != 0) {
            return;
        }
        let creeps = this.find(tower);
        if (creeps.length == 0) {
            Memory['towerStat'] = 'normal';
        } else if (creeps.length > 5) {
            Memory['towerStat'] = 'attack';
        } else {
            Memory['towerStat'] = 'less';
        }
        if (Game.time % 50 == 0) {
            global[`towerRequest${tower.id}`] = false;
        }
        if (tower.store.getFreeCapacity(RESOURCE_ENERGY) > 20) {
            let task = `requestEneryge ${
                this.room.storage ? this.room.storage.id : ''
            } ${this.id}`;

            if (Memory.porterTasker.includes(task)) {
                return;
            }
            let a = Memory.porterTasker.shift();
            Memory.porterTasker.unshift(task);
            Memory.porterTasker.unshift(a);
        }
    }

    private normal(tower: StructureTower) {
        let hurtCreep = tower.room.find(FIND_MY_CREEPS, {
            filter: (creep) => {
                return creep.hitsMax - creep.hits > 0;
            },
        });
        let hurtBuild = tower.room
            .find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        structure.hitsMax - structure.hits &&
                        structure.hits < 100000 &&
                        structure.hitsMax - structure.hits > 0
                    );
                },
            })
            .sort((a, b) => {
                return a.hits - b.hits;
            });
        if (hurtCreep.length > 0) {
            tower.heal(hurtCreep[0]);
        } else if (hurtBuild.length > 0) {
            tower.repair(hurtBuild[0]);
        }
    }

    private less(tower: StructureTower) {
        let attack = this.find(tower);
        tower.attack(attack[0]);
    }
    private more(tower: StructureTower) {
        this.less(tower);
    }
}
export function mountTower() {
    assignPrototype(StructureTower, towerExt);
}
