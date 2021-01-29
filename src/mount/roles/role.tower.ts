import { structure } from 'base';
import globalObj from './globalObj';
import { filter as filte } from 'whiteList';
import { assignPrototype, requestEnergy } from '../../utils';
export default class towerExt extends StructureTower implements structure {
    public work(): void {
        this.check(this);
        if (!Memory.towerStat) {
            Memory.towerStat={}
        }
        switch (Memory.towerStat[this.room.name]) {
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

    private check(tower: StructureTower) {
        if (Game.time % 5 != 0) {
            return;
        }
        let creeps =
            Game.getObjectById(
                global.TowerTarget
                    ? global.TowerTarget[this.room.name]
                    : ('' as Id<Creep>)
            ) || find(tower);
        console.log(creeps);

        if (!creeps) {
            Memory.towerStat[tower.room.name] = 'normal';
        } else if (
            tower.room.find(FIND_HOSTILE_CREEPS, {
                filter: (it) => {
                    return (
                        filte(it) &&
                        (it.body.find((it) => {
                            return it.type == ATTACK;
                        }) ||
                            it.body.find((it) => {
                                return it.type == WORK;
                            }) ||
                            it.body.find((it) => {
                                return it.type == RANGED_ATTACK;
                            }))
                    );
                }
            }).length >= 4
        ) {
            Memory['towerStat'][tower.room.name] = 'beAttack';
        } else {
            Memory['towerStat'][tower.room.name] = 'less';
        }
        if (tower.store.getFreeCapacity(RESOURCE_ENERGY) > 10) {
            requestEnergy(this.id, this.room.name, true);
        }
    }
    private normal(tower: StructureTower) {
        let hurtCreep = tower.room.find(FIND_MY_CREEPS, {
            filter: (creep) => {
                return creep.hitsMax - creep.hits > 0;
            }
        });

        if (hurtCreep.length > 0) {
            tower.heal(hurtCreep[0]);
        } else {
            let hurtBuild = tower.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        structure.hits < 25000 &&
                        structure.hitsMax - structure.hits > 0
                    );
                }
            });
            hurtBuild.sort((a, b) => a.hits - b.hits);
            tower.repair(hurtBuild[0]);
        }
    }
    private less(tower: StructureTower) {
        let target = find(tower);
        if (target) tower.attack(target);
    }
    private more(tower: StructureTower) {
        this.less(tower);
    }
}
export function mountTower() {
    assignPrototype(StructureTower, towerExt);
}
export function find(tower: StructureTower): Creep | undefined | null {
    if (!global.TowerTarget) {
        global.TowerTarget = {};
    }
    console.log(tower.room.name);
    
    const target = Game.getObjectById(global.TowerTarget[tower.room.name]);
    console.log(global.TowerTarget[tower.room.name],target);
    
    if (
        global.TowerTarget[tower.room.name] &&
        target
    ) {
        return target;
    }
    let result = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
        filter: (it) => {
            return (
                filte(it) &&
                !it.pos.isOnEdge(2) &&
                it.body.find((it) => {
                    return (
                        it.type == WORK ||
                        it.type == RANGED_ATTACK ||
                        it.type == ATTACK ||
                        it.type == CLAIM ||
                        it.type == HEAL
                    );
                })
            );
        }
    });
    if (result) {
        global.TowerTarget[tower.room.name] = result.id;
        return result;
    }
}
