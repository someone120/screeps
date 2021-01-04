import { creepExt } from '../../base';
export class attacker extends Creep implements creepExt {
    type: Number = 13;
    work() {
        let flag =
            Game.flags[
                Object.keys(Game.flags).find((it) => {
                    return it.split('_')[0] == 'AttackRoom';
                })!
            ];
        if (!flag) return;
        if (!flag.room) {
            this.farMoveTo(flag.pos);
            return;
        }
        if (this.room.name != flag.room.name) {
            this.farMoveTo(flag.pos);
            return;
        } else {
            if (this.pos.isOnEdge()) {
                this.goTo(this.room.getPositionAt(20, 20)!);
            }
            flag = Game.flags['str'];
            if (flag) {
                let structure = flag.pos.lookFor(LOOK_STRUCTURES);
                if (structure.length > 0) {
                    if (
                        this.rangedAttack(structure[0]) == ERR_NOT_IN_RANGE ||
                        this.attack(structure[0]) == ERR_NOT_IN_RANGE ||
                        this.dismantle(structure[0]) == ERR_NOT_IN_RANGE
                    ) {
                        this.goTo(structure[0].pos);
                        return;
                    }
                    return;
                }
                flag.remove();
                this.say('wdnmd假旗子');
                return;
            }
            let enemy = this.room.find(FIND_HOSTILE_CREEPS);
            if (enemy.length > 0) {
                if (
                    !(
                        this.rangedAttack(enemy[0]) == ERR_NOT_IN_RANGE &&
                        this.attack(enemy[0]) == ERR_NOT_IN_RANGE
                    )
                ) {
                    this.goTo(enemy[0].pos);
                }
                return;
            }
            let structure = this.room.find(FIND_HOSTILE_STRUCTURES);
            if (structure.length > 0) {
                if (
                    this.rangedAttack(structure[0]) == ERR_NOT_IN_RANGE ||
                    this.attack(structure[0]) == ERR_NOT_IN_RANGE ||
                    this.dismantle(structure[0]) == ERR_NOT_IN_RANGE
                ) {
                    this.goTo(structure[0].pos);
                    return;
                }
                return;
            }
        }
    }
}
