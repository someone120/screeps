export interface base{
    work():void
}

export interface creep extends base{
    task:String
    type:Number
}

export interface structure extends base{
    
}

