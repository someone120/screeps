export interface base{
    work():void
}
export class creepExt extends Creep implements base{
    work(): void {
        this.memory.haveMove=false;
    }
    type:Number=-1;
}
export interface structure extends base{
}
