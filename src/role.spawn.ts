import { settings } from 'cluster';
import { structure } from './base';
import { mountTower } from './role.tower';
import { bodySet } from './setting';
import { pushCarrierTask, pushSpawnTask } from './task.manager';
import { assignPrototype, encode } from './util';
const MinersNumber = 2;
const PorterNumber = 8;
const KeeperNumber = 5;
const HealerNumber = 8;
export default class spawnExt extends StructureSpawn implements structure {
    work() {
        if (Memory['spawnTask'].length <= 0) this.memory['send'] = false;
        if (this.memory['send'] && Game.time % 100 == 0) {
            this.memory['send'] = false;
        }
        if (!this.spawning && !this.memory['send']) {
            let available = this.room.energyCapacityAvailable;
            if (available >= 10000) {
                available = 10000;
            } else if (available >= 5600) {
                available = 5600;
            } else if (available >= 2300) {
                available = 2300;
            } else if (available >= 1800) {
                available = 1800;
            } else if (available >= 1300) {
                available = 1300;
            } else if (available >= 800) {
                available = 800;
            } else if (available >= 550) {
                available = 550;
            } else if (available >= 300) {
                available = 300;
            }
            let miners = Memory['type'][0];
            let builder = Memory['type'][1];
            let Porter = Memory['type'][2];
            let Keeper = Memory['type'][3];
            let healer = Memory['type'][4];
            let remote = Memory['remote'];
            if (Porter == 0) {
                available = 300;
            }
            if (miners < MinersNumber) {
                this.pushHarvester(this, available);
                this.memory['send'] = true;
            } else if (Porter < PorterNumber) {
                this.pushCarrier(this, available);
                this.memory['send'] = true;
            } else if (builder + healer < HealerNumber) {
                this.pushBuilder(this, available);
                this.memory['send'] = true;
            } else if (Keeper < KeeperNumber) {
                this.pushUpgrader(this, available);
                this.memory['send'] = true;
            }
        }
        if (
            this.room.energyCapacityAvailable - this.room.energyAvailable > 0 &&
            !this.memory['isSend']
        ) {
            pushCarrierTask(
                `carry ${this.room.storage ? this.room.storage.id : ''} ${
                    this.name
                }`
            );
            this.memory['isSend'] = true;
        }
    }

    private pushHarvester(spawn: StructureSpawn, i: Number) {
        pushSpawnTask(`Harvester ${spawn.name} ${i}`);
    }
    private pushCarrier(spawn: StructureSpawn, i: Number) {
        pushSpawnTask(`Carrier ${spawn.name} ${i}`);
    }
    private pushBuilder(spawn: StructureSpawn, i: Number) {
        pushSpawnTask(`Builder ${spawn.name} ${i}`);
    }
    private pushUpgrader(spawn: StructureSpawn, i: Number) {
        pushSpawnTask(`Upgrader ${spawn.name} ${i}`);
    }
}
export function mountSpawn() {
    assignPrototype(StructureSpawn, spawnExt);
}
