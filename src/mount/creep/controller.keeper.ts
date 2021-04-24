import { getQuote, isContainer, isStorage } from 'utils';
import { creepExt } from 'ScreepsBase';
export class Upgrader extends creepExt {
    type: Number = 3;
    work() {
        super.work()
        if (this.memory['building'] && this.store[RESOURCE_ENERGY] == 0) {
            
            this.room.removeRestrictedPos(this.name)
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
    }
}
