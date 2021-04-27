import {
    getMinerFirstAvailableFlag,
    setMinerAvailableFlag,
    setMinerUnavailableFlag
} from 'flag';
import {creepExt} from 'ScreepsBase';
import {buildRoad} from 'utils';

export function check(creep:Creep) {
    let hostile = creep.room.find(FIND_HOSTILE_CREEPS);
    if (hostile.length > 0 && !creep.room.memory.hasSend) {
        creep.room.memory.isLockByProtect = false
        creep.room.memory.hasSend = true;
    }
}

export class remoteMiner extends creepExt {
    type: Number = 5;

    work(): void {
        check(this);
        let source = Game.flags[this.memory.flagName!];
        if (!source) {
            setMinerAvailableFlag(this.memory.flagName!);
            let flag = getMinerFirstAvailableFlag();
            if (!flag) return;
            this.memory.flagName = flag;
            setMinerUnavailableFlag(flag);
            return;
        }
        if ((this.ticksToLive || 1500) <= 10 && this.memory['flagName']) {
            setMinerAvailableFlag(this.memory['flagName']);
            this.suicide();
        }
        let container = this.pos.lookFor(LOOK_STRUCTURES).find((it) => {
            return it.structureType == STRUCTURE_CONTAINER;
        }) as StructureContainer;

        if (
            this.pos.isNearTo(source.pos) &&
            !container &&
            !this.pos.lookFor(LOOK_CONSTRUCTION_SITES).find((it) => {
                return it.structureType == STRUCTURE_CONTAINER;
            })
        ) {
            this.pos.createConstructionSite(STRUCTURE_CONTAINER);
        }
        if (
            this.pos.isNearTo(source.pos) &&
            container &&
            container.hitsMax - container.hits > 0 &&
            container.hits <= 250000 &&
            this.store.energy > 0
        ) {
            this.repair(container);
            return;
        }

        const constructionSite = this.pos
            .lookFor(LOOK_CONSTRUCTION_SITES)
            .find((it) => {
                return (
                    it.structureType == STRUCTURE_CONTAINER ||
                    it.structureType == STRUCTURE_ROAD
                );
            });
        if (
            constructionSite &&
            this.store.energy >= this.getActiveBodyparts(WORK) * 5
        ) {
            this.build(constructionSite);
        }
        const eng = this.pos.lookFor(LOOK_ENERGY)[0];
        if (eng) {
            this.pickup(eng);
        }
        if (container && container.store.energy > 0) {
            this.withdraw(container, RESOURCE_ENERGY);
        }
        if (source && this.pos.roomName == source.pos.roomName) {
            if (
                (container && container.store.getFreeCapacity() > 0) ||
                !container
            ) {
                const result = this.harvest(
                    source.pos.lookFor(LOOK_SOURCES)[0]
                );
                if (result == ERR_NOT_IN_RANGE) {
                    this.farMoveTo(source.pos, 1);
                }
                if (result == OK) {
                    this.memory.standed = true;
                    this.room.addRestrictedPos(this.name, this.pos);
                }
            }
        } else {
            if (source) this.farMoveTo(source.pos, 1);
        }
        if (source.color == COLOR_ORANGE) {
            try {
                buildRoad(
                    Game.rooms[this.memory.roomID].storage!.pos,
                    source.pos
                );
                source.setColor(COLOR_WHITE);
            } catch (error) {
            }
        }
    }
}
