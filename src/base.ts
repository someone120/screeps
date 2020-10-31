export interface base{
    work():void
}
export interface creep extends base{
    task:string
    type:Number
}
export interface structure extends base{
}
