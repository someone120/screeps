import { creepExt } from 'base';
import { getSourceFlags } from 'utils';
export class Repairer extends Creep implements creepExt {
    type: Number = 4;
    work() {
        let flag = getSourceFlags();
        if (this.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            this.room.removeRestrictedPos(this.name)
            if (
                this.room.storage &&
                this.room.storage.store[RESOURCE_ENERGY] > 0
            ) {
                if (
                    this.withdraw(this.room.storage, RESOURCE_ENERGY) ==
                    ERR_NOT_IN_RANGE
                ) {
                    this.goTo(this.room.storage.pos);
                }
            } else {
                const source2 = this.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            structure.structureType == STRUCTURE_CONTAINER &&
                            structure.store.energy > 0
                        );
                    }
                });

                if (source2) {
                    const result = this.withdraw(source2, RESOURCE_ENERGY);
                    if (result == ERR_NOT_IN_RANGE) {
                        this.goTo(source2.pos);
                    }
                } else {
                    const source1 = this.pos.findClosestByRange(
                        FIND_DROPPED_RESOURCES
                    );
                    if (source1 && this.pickup(source1) == ERR_NOT_IN_RANGE) {
                        this.goTo(source1.pos);
                    }
                }
            }
        } else {
            let target = this.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (it) => {
                    return (
                        it.hits < 100000 &&
                        it.hitsMax - it.hits > 0 &&
                        it.structureType != STRUCTURE_WALL
                    );
                }
            });
            if (target) {
                let res = this.repair(target);
                if (res == ERR_NOT_IN_RANGE) {
                    this.goTo(target.pos);
                }
                return;
            }
            let targets = Game.rooms[this.memory['roomID']].find(
                FIND_STRUCTURES,
                {
                    filter: (it) => {
                        return (
                            it.hits < 100000 &&
                            it.hitsMax - it.hits > 0 &&
                            it.structureType != STRUCTURE_WALL
                        );
                    }
                }
            );
            if (targets.length > 0) {
                let target = targets[0];
                let res = this.repair(target);
                if (res == ERR_NOT_IN_RANGE) {
                    this.goTo(target.pos);
                }
                return;
            }
            targets = [];
            flag.forEach((it) => {
                if (!it.room) {
                    return;
                }
                targets = targets.concat(
                    it.room.find(FIND_STRUCTURES, {
                        filter: (it) => {
                            return (
                                it.hits < 100000 &&
                                it.hitsMax - it.hits > 0 &&
                                it.structureType != STRUCTURE_WALL &&
                                it.structureType != STRUCTURE_INVADER_CORE
                            );
                        }
                    })
                );
            });

            if (targets.length > 0) {
                let target = targets[0];
                let res = this.repair(target);
                if (res == OK) {
                    this.memory.standed = true;
                    this.room.addRestrictedPos(this.name, this.pos);
                } else if (res == ERR_NOT_IN_RANGE) {
                    this.goTo(target.pos);
                }
                return;
            }

            // if (!global['all']) global['all'] = target.length;
            // if (Memory.type[this.memory.roomID][4] == 1) console.log(global['all'] - target.length + ":" + global['all']);
        }
        
        let targets = Game.rooms[this.memory['roomID']].find(
            FIND_CONSTRUCTION_SITES
        );
        flag = Object.values(Game.flags);
        flag.find((it) => {
            if (it.room) {
                let t = it.room.find(FIND_CONSTRUCTION_SITES);
                if (t.length > 0) {
                    targets = targets.concat(t);
                    return;
                }
            }
        });
        if (
            ~~(targets.length * 2.5) > Memory.type[this.memory.roomID][1]
        ) {
            Memory.type[this.memory.roomID][1]++;
            Memory.type[this.memory.roomID][4]--;
            this.memory.type = 1;
            return;
        }
        let needRepair = this.room.find(FIND_STRUCTURES, {
            filter: (it) => {
                return (
                    it.hits < 100000 &&
                    it.hitsMax - it.hits > 0 &&
                    it.structureType != STRUCTURE_WALL
                );
            }
        });
        if (needRepair.length <= 1) {
            Memory.type[this.memory.roomID][4]--;
            Memory.type[this.memory.roomID][3]++;
            this.memory.type = 3;
            return;
        }
    }
}
