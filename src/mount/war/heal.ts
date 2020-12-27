import { creepExt } from '../../base';
class healer extends Creep implements creepExt {
    
    type: Number = 11;
    work() {
        let follow = Game.creeps[this.memory.followName];
        if (!follow) {
            this.suicide();
            return;
        }
        if (this.hitsMax - this.hits > 0) {
            this.heal(this);
        }
        if (follow.hitsMax - follow.hits > 0) {
            this.heal(follow);
            return;
        }
        this.move(follow);
    }
}
