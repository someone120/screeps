import { assignPrototype } from "GameUtils";
import { creepMoveExt } from "./creepMoveExt";

export function mountMove(){
    if (!Creep.prototype._move) Creep.prototype._move = Creep.prototype.move
    assignPrototype(Creep,creepMoveExt)
}