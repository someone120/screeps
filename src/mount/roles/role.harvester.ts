import { creepExt } from "ScreepsBase";
import { pushSpawnTask } from "mount/tasks/task.manager";
import { getSourceLink, getStorageLink } from "utils";
// import { getSourceLink } from 'GameUtils';
//获取energy
export class harvester extends creepExt {
  type: Number = 0;
  work() {
    super.work();
    if (!this.memory.sourceID) {
      this.memory.sourceID = this.room.sources[0].id;
    }
    let target = Game.getObjectById<Source>(this.memory.sourceID);
    if (!target) {
      return;
    }
    const mine = this.harvest(target);
    const container = this.pos.findInRange(FIND_STRUCTURES, 1).find((it) => {
      return it.structureType == STRUCTURE_CONTAINER;
    });

    if (mine == ERR_NOT_IN_RANGE) {
      this.goTo(target.pos, { range: 1 });
    } else if (mine == OK) {
      this.memory.standed = true;
      this.room.addRestrictedPos(this.name, this.pos);
      if (
        this.room.controller!.level >= 5 &&
        getSourceLink(this.room.name, this.pos) &&
        getStorageLink(this.room.name)
      ) {
        if (
          getSourceLink(this.room.name, this.pos).store.getFreeCapacity(
            RESOURCE_ENERGY
          ) > 0
        ) {
          this.transfer(
            getSourceLink(this.room.name, this.pos),
            RESOURCE_ENERGY
          );
        }
        if (container) {
          container.destroy();
        }
      } else {
        const construct = this.pos.findInRange(FIND_CONSTRUCTION_SITES, 1);
        if (!container && !construct) {
          this.pos.createConstructionSite(STRUCTURE_CONTAINER);
        } else {
          if (container) {
            if (
              this.store[RESOURCE_ENERGY] > this.getActiveBodyparts(WORK) * 2 &&
              container.hitsMax - container.hits > 0
            ) {
              this.repair(container);
            }
          } else {
            if (
              this.store[RESOURCE_ENERGY] >
              this.getActiveBodyparts(WORK) * 2
            ) {
              this.build(construct[0]);
            }
          }
        }
      }
    }
    if (this.memory.spentTime == undefined) {
      this.memory.spentTime =
        PathFinder.search(
          this.pos,
          this.pos.findClosestByRange(FIND_MY_SPAWNS)?.pos || this.pos
        ).cost +
        this.body.length * 3 +
        30;
    }
    if (this.ticksToLive && this.ticksToLive < this.memory.spentTime) {
      this.room.removeRestrictedPos(this.name);
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
      if (!Memory.spawnTask) {
        Memory.spawnTask = {};
      }
      if (!Memory.spawnTask[this.room.name]) {
        Memory.spawnTask[this.room.name] = [];
      }
      if (!global["spawnTask"]) {
        global["spawnTask"] = {};
      }
      let task = `Harvester ${available} ${this.memory.sourceID}`;
      if (this.memory.isSend) {
        return;
      }
      console.log(
        `<p style="color: #8BC34A;">[${this.room.name}]发布了任务：${task}</p>`
      );
      Memory.spawnTask[this.room.name].unshift(task);
      this.memory.isSend = true;
    }
    if (this.ticksToLive && this.ticksToLive < 10) {
      this.room.unlockSource(this.memory.sourceID as Id<Source>);
    }
    if (this.store.getFreeCapacity(RESOURCE_ENERGY) == 0 && container) {
      this.transfer(container, RESOURCE_ENERGY);
    } else {
      this.drop(RESOURCE_ENERGY);
    }
  }
}
