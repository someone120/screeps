import { getQuote } from "utils";
import { creepExt } from "ScreepsBase";
import { getReserverFirstAvailableFlag, setReserverAvailableFlag } from "flag";
import { pushSpawnTask } from "mount/tasks/task.manager";
import { check } from "./remoteMiner";

export class reserve extends creepExt {
  type: Number = 6;

  work(): void {
    super.work();
    check(this);
    let source = Game.flags[this.memory.flagName!];
    if (!source) {
      setReserverAvailableFlag(this.memory.flagName!);
      let flag = getReserverFirstAvailableFlag();
      this.memory.flagName = flag;
      setReserverAvailableFlag(flag!);
      return;
    }
    if (source && source.room) {
      let controller = source.room.controller;
      if (!controller) {
        this.farMoveTo(source.pos, 1);
        return;
      }
      const text = getQuote(this.room.controller?.id || "awa");
      if (!(controller.sign && controller.sign.text == text)) {
        if (this.signController(controller, text) == ERR_NOT_IN_RANGE) {
          this.farMoveTo(controller.pos, 1);
        }
        return;
      }
      if (
        this.room.controller!.reservation &&
        this.room.controller!.reservation.username != this.owner.username
      ) {
        if (this.attackController(controller) == ERR_NOT_IN_RANGE) {
          this.farMoveTo(controller.pos, 1);
        }
        return;
      }
      const result = this.reserveController(controller);
      if (result == ERR_NOT_IN_RANGE) {
        this.farMoveTo(controller.pos, 1);
      } else if (result == OK) {
        this.memory.standed = true;
        this.room.addRestrictedPos(this.name, this.pos);
      }
    } else if (source) {
      this.farMoveTo(source.pos, 1);
    } else {
      this.pos.findClosestByRange(FIND_MY_SPAWNS)?.recycleCreep(this);
    }
  }
}
