export interface base{
    work():void
}
export interface creepExt extends base{
    task:string
    type:Number
}
export interface structure extends base{
}
