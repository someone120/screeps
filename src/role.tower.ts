const WHITE_LIST = [];
import { structure } from 'base';
import { assignPrototype, requestEnergy } from './utils';
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
        return tower.room.find(FIND_HOSTILE_CREEPS);
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
        if (
            tower.store.getFreeCapacity(RESOURCE_ENERGY) > 20 &&
            Memory['towerStat'] == 'normal'
        ) {
            requestEnergy(
                this.room.storage ? this.room.storage.id : '',
                this.id
            );
        } else if (
            tower.store.getFreeCapacity(RESOURCE_ENERGY) > 20 &&
            Memory['towerStat'] != 'normal'
        ) {
            let task = `requestEneryge ${
                this.room.storage ? this.room.storage.id : ''
            } ${this.id}`;
            if (
                Memory.porterTasker.includes(task) ||
                global['porterTasksTaken'].includes(task)
            ) {
                return;
            }
            console.log(
                `<p style="color: #8BC34A;">[${this.id}]发布了任务：${task}</p>`
            );
            Memory.porterTasker.unshift(task);
        }
    }
    private normal(tower: StructureTower) {
        let hurtCreep = tower.room.find(FIND_MY_CREEPS, {
            filter: (creep) => {
                return creep.hitsMax - creep.hits > 0;
            }
        });
        let hurtBuild = tower.room
            .find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        structure.hits < 25000 &&
                        structure.hitsMax - structure.hits > 0
                    );
                }
            })
            .sort((a, b) => {
                return a.hitsMax - a.hits - (b.hitsMax - b.hits);
            });
        if (hurtCreep.length > 0) {
            tower.heal(hurtCreep[0]);
        } else if (hurtBuild.length > 0) {
            tower.repair(hurtBuild[0]);
        }
    }
    private less(tower: StructureTower) {
        let attack = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            filter: (creep) => {
                return !WHITE_LIST.includes(creep.owner.username);
            }
        });
        tower.attack(attack);
    }
    private more(tower: StructureTower) {
        this.room.controller.activateSafeMode();
        this.less(tower);
    }
}
export function mountTower() {
    assignPrototype(StructureTower, towerExt);
}
