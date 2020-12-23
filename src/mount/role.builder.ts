import { getSourceFlags } from 'utils';
import { creepExt } from 'base';
import { object } from 'lodash';
export class builder extends Creep implements creepExt {
    task: string;
    type: Number = 1;
    /** @param {Creep} this **/
    work() {
        if (this.memory['building'] && this.store[RESOURCE_ENERGY] == 0) {
            this.memory['building'] = false;
            this.say('🔄 harvest');
        }
        if (!this.memory['building'] && this.store.getFreeCapacity() == 0) {
            this.memory['building'] = true;
            this.say('🚧 build');
        }
        let targets = Game.rooms[this.memory['roomID']].find(
            FIND_CONSTRUCTION_SITES
        );
        let flag = Object.values(Game.flags);
        flag.find((it) => {
            if (it.room) {
                let t = it.room.find(FIND_CONSTRUCTION_SITES);
                if (t.length > 0) {
                    targets = targets.concat(t);
                    return;
                }
            }
        });
        if (this.memory['building']) {
            if (targets.length >= 0) {
                const result = this.build(targets[0]);
                if (result == ERR_NOT_IN_RANGE) {
                    this.goTo(targets[0].pos);
                }
                if (result == OK) {
                    this.room.addRestrictedPos(this.name, this.pos);
                }
            }
        } else {
            let source2: StructureContainer[] = this.room.find(
                FIND_STRUCTURES,
                {
                    filter: (structure) => {
                        return (
                            structure.structureType == STRUCTURE_CONTAINER &&
                            structure.store.energy > 0
                        );
                    },
                }
            ) as StructureContainer[];
            if (source2.length != 0) {
                const result = this.withdraw(source2[0], RESOURCE_ENERGY);
                if (result == ERR_NOT_IN_RANGE) {
                    this.goTo(source2[0].pos);
                }
                return;
            }
            let source1: Resource<ResourceConstant>[] = this.room.find(
                FIND_DROPPED_RESOURCES,
                {
                    filter: (it) => {
                        return it.resourceType == RESOURCE_ENERGY;
                    },
                }
            );
            if (source1.length) {
                if (this.pickup(source1[0]) == ERR_NOT_IN_RANGE) {
                    this.goTo(source1[0].pos);
                }
                return;
            }
            if (Game.rooms[this.memory['roomID']].storage) {
                if (
                    this.withdraw(
                        Game.rooms[this.memory['roomID']].storage,
                        RESOURCE_ENERGY
                    ) == ERR_NOT_IN_RANGE
                ) {
                    this.goTo(Game.rooms[this.memory['roomID']].storage.pos);
                }
            }
        }
        if (~~(targets.length * 2.5) < Memory.type[this.memory.roomID][1]) {
            Memory.type[this.memory.roomID][1]--;
            Memory.type[this.memory.roomID][4]++;
            this.memory.type = 4;
        }
    }
}
