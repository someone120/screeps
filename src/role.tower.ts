import { structure } from 'base';
import { filter as filte } from 'whiteList';
import { assignPrototype, requestEnergy } from './utils';
export default class towerExt extends StructureTower implements structure {
    public work(): void {
        this.check(this);
        switch (Memory.towerStat) {
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
        let creeps = find(tower);
        if (!creeps) {
            Memory.towerStat = 'normal';
        } else if (
            tower.room.find(FIND_HOSTILE_CREEPS, {
                filter: (it) => {
                    return (
                        filte(it) &&
                        !it.pos.isOnEdge() &&
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
                },
            }).length >= 4
        ) {
            Memory['towerStat'] = 'beAttack';
        } else {
            Memory['towerStat'] = 'less';
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
export function find(tower: StructureTower): Creep | undefined {
    if (!global.TowerTarget) {
        global.TowerTarget = {};
    }
    if (
        global.TowerTarget[tower.room.name] &&
        Game.getObjectById(global.TowerTarget[tower.room.name]) &&
        Game.getObjectById(global.TowerTarget[tower.room.name])!!.room.name ==
            tower.room.name
    ) {
        return Game.getObjectById(global.TowerTarget[tower.room.name])!!;
    }
    let result = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
        filter: (it) => {
            return (
                filte(it) &&
                !it.pos.isOnEdge() &&
                it.body.find((it) => {
                    return (
                        it.type == WORK ||
                        it.type == RANGED_ATTACK ||
                        it.type == ATTACK ||
                        it.type == CLAIM
                    );
                })
            );
        },
    });
    if (result) {
        global.TowerTarget[tower.room.name] = result.id;
        return result;
    }
}
