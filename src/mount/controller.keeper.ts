import { getQuote } from 'utils';
import { creepExt } from 'base';
export class Upgrader extends Creep implements creepExt {
    type: Number = 3;
    work() {
        if (this.memory['building'] && this.store[RESOURCE_ENERGY] == 0) {
            this.memory['building'] = false;
            this.say('🔄 harvest');
        }
        if (!this.memory['building'] && this.store.getFreeCapacity() == 0) {
            this.memory['building'] = true;
            this.say('🚧 build');
        }
        if (this.memory['building']) {
            let targets = Game.rooms[this.memory['roomID']].controller!;
            const text = getQuote(
                Game.rooms[this.memory['roomID']].controller!.id
            );
            if (!(targets.sign && targets.sign.text == text)) {
                if (this.signController(targets, text) == ERR_NOT_IN_RANGE) {
                    this.goTo(targets.pos);
                }
            }
            const result = this.upgradeController(targets);
            if (result == ERR_NOT_IN_RANGE) {
                this.goTo(targets.pos, { range: 3 });
            }
            if (result == OK) {
                this.room.addRestrictedPos(this.name, this.pos);
            }
        } else {
            let source2 =
                Game.rooms[this.memory['roomID']].controller!.pos.findInRange(
                    FIND_STRUCTURES,
                    3,
                    {
                        filter: (it) => {
                            return (
                                it.structureType == STRUCTURE_LINK &&
                                it.store[RESOURCE_ENERGY] > 0
                            );
                        }
                    }
                ) ||
                (Game.rooms[this.memory['roomID']].storage &&
                    Game.rooms[this.memory['roomID']].storage!.store[
                        RESOURCE_ENERGY
                    ] > 0)
                    ? Game.rooms[this.memory['roomID']].storage
                    : null;
            if (!source2) {
                const source2 = Game.rooms[this.memory['roomID']].find(
                    FIND_STRUCTURES,
                    {
                        filter: (structure) => {
                            return (
                                structure.structureType ==
                                    STRUCTURE_CONTAINER &&
                                structure.store.energy > 0
                            );
                        }
                    }
                ) as StructureContainer[];
                source2.sort((a, b) => {
                    return b.store.energy - a.store.energy;
                });
                if (source2.length != 0) {
                    const result = this.withdraw(source2[0], RESOURCE_ENERGY);
                    if (result == ERR_NOT_IN_RANGE) {
                        this.goTo(source2[0].pos);
                    }
                } else {
                    const source1 = Game.rooms[this.memory['roomID']].find(
                        FIND_DROPPED_RESOURCES
                    )[0];
                    if (this.pickup(source1) == ERR_NOT_IN_RANGE) {
                        this.goTo(source1.pos);
                    }
                }
                return;
            }
            if (this.withdraw(source2, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.goTo(source2.pos);
            }
        }
    }
}
