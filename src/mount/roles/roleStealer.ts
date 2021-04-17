import { creepExt } from "ScreepsBase";

export class Stealer extends creepExt {
    type: Number = 14;
    work(): void {
        super.work()
        let flag = Game.flags['Steal'];
        if (!flag) {
            this.say("🎏❓")
            return;
        }
        if (this.store.getFreeCapacity() == 0) {
            if (this.transfer(Game.rooms[this.memory.roomID].storage!, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.goTo(Game.rooms[this.memory.roomID].storage?.pos || new RoomPosition(25, 25, this.memory.roomID))
            }
            return
        }
        if (this.pos.isNearTo(flag.pos)) {
            this.withdraw(flag.pos.lookFor(LOOK_STRUCTURES)!.find((it)=>{return !!it.store})!, RESOURCE_ENERGY)
            return
        }
        this.goTo(flag.pos)
    }
}