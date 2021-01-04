import { getQuote, isContainer, isStorage } from 'utils';
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
            
                let target:
                    | StructureContainer
                    | StructureStorage
                    | Resource
                    | undefined =
                    this.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                        filter: (it) => {
                            return it.resourceType == RESOURCE_ENERGY;
                        }
                    }) ||
                    (this.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (it) => {
                            return (
                                it.structureType == STRUCTURE_CONTAINER &&
                                it.store[RESOURCE_ENERGY] > 0
                            );
                        }
                    }) as StructureContainer) ||
                    (this.room.storage &&
                    this.room.storage.store[RESOURCE_ENERGY] > 0
                        ? this.room.storage
                        : undefined);
            if (target) {
                if (isContainer(target)) {
                    this.withdraw(target, RESOURCE_ENERGY);
                } else if (isStorage(target)) {
                    this.withdraw(target, RESOURCE_ENERGY);
                } else {
                    this.pickup(target);
                }
                this.goTo(target.pos);
            }
        }
    }
}
