import { creepExt } from '../../base';
export class attacker extends Creep implements creepExt {
    task: string;
    type: Number = 10;
    work() {
        let flag =
            Game.flags[
                Object.keys(Game.flags).find((it) => {
                    return it.split('_')[0] == 'AttackRoom';
                })
            ];
        if (!flag) return;
        if (this.room.name != flag.room.name) {
            this.goTo(flag);
            return;
        } else {
            flag = Game.flags['str'];
            if (flag) {
                let structure = flag.pos.lookFor(LOOK_STRUCTURES);
                if (structure.length > 0) {
                    if (
                        !(
                            this.rangedAttack(structure[0]) ==
                                ERR_NOT_IN_RANGE &&
                            this.attack(structure[0]) == ERR_NOT_IN_RANGE
                        )
                    ) {
                        this.goTo(structure[0]);
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
                    this.goTo(enemy[0]);
                }
                return;
            }
            let structure = this.room.find(FIND_HOSTILE_STRUCTURES);
            if (structure.length > 0) {
                if (
                    !(
                        this.rangedAttack(structure[0]) == ERR_NOT_IN_RANGE &&
                        this.attack(structure[0]) == ERR_NOT_IN_RANGE
                    )
                ) {
                    this.goTo(structure[0]);
                    return;
                }
                return;
            }
            this.goTo(this.room.getPositionAt(20, 20));
        }
    }
}
