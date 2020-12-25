import { structure } from 'base';
import { pushCarrierTask } from 'task.manager';
import { filter as filte } from 'whiteList';
import { assignPrototype, requestEnergy, WHITE_LIST } from './utils';
export default class towerExt extends StructureTower implements structure {
    public work(): void {
        this.check(this);
        switch (Memory['towerStat']) {
            case 'beAttack':
                this.more(this);
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
            filter: (it) => {
                return (
                    filte(it) &&
                    (it.body.find((it) => {
                        return it.type == ATTACK;
                    }) ||
                        it.body.find((it) => {
                            return it.type == WORK;
                        }))
                );
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
        } else if (creeps.length >= 4) {
            Memory['towerStat'] = 'beAttack';
        } else {
            Memory['towerStat'] = 'less';
        }
        if (Game.time % 50 == 0) {
            global[`towerRequest${tower.id}`] = false;
        }
        if (tower.store.getFreeCapacity(RESOURCE_ENERGY) > 10) {
            requestEnergy(this.id, this.room.name, true);
        }
    }
    private normal(tower: StructureTower) {
        let hurtCreep = tower.room.find(FIND_MY_CREEPS, {
            filter: (creep) => {
                return creep.hitsMax - creep.hits > 0;
            },
        });
        let hurtBuild = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                    structure.hits < 25000 &&
                    structure.hitsMax - structure.hits > 0
                );
            },
        });
        if (hurtCreep.length > 0) {
            tower.heal(hurtCreep[0]);
        } else if (hurtBuild) {
            tower.repair(hurtBuild);
        }
    }
    private less(tower: StructureTower) {
        let attack = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            filter: filte,
        });
        tower.attack(attack);
    }
    private more(tower: StructureTower) {
        this.less(tower);
    }
}
export function mountTower() {
    assignPrototype(StructureTower, towerExt);
}
