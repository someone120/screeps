import {
    getMinerFirstAvailableFlag,
    setMinerAvailableFlag,
    setMinerUnavailableFlag
} from 'flag';
import { creepExt } from 'base';
export class remoteMiner extends Creep implements creepExt {
    task: string;
    type: Number = 5;
    work(): void {
        let source = Game.flags[this.memory.flagName];
        if (!source) {
            setMinerAvailableFlag(this.memory.flagName);
            let flag = getMinerFirstAvailableFlag();
            this.memory.flagName = flag;
            setMinerUnavailableFlag(flag);
            return;
        }
        if (this.ticksToLive <= 10 && this.memory['flagName']) {
            setMinerAvailableFlag(this.memory['flagName']);
            this.suicide();
        }
        let container = this.pos.lookFor(LOOK_STRUCTURES).find((it) => {
            return it.structureType == STRUCTURE_CONTAINER;
        });

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
                this.harvest(source.pos.lookFor(LOOK_SOURCES)[0]) ==
                ERR_NOT_IN_RANGE
            ) {
                this.goTo(source.pos);
            }
        } else {
            if (source) this.goTo(source.pos);
        }
    }
}
