export default class RoomExtension extends Room {
    public unserializePos(posStr: string): RoomPosition | undefined {
        // 形如 ["12", "32", "E1N2"]
        const infos = posStr.split('/');

        return infos.length === 3
            ? new RoomPosition(Number(infos[0]), Number(infos[1]), infos[2])
            : undefined;
    }
    public serializePos(pos: RoomPosition): string {
        return `${pos.x}/${pos.y}/${pos.roomName}`;
    }
    public getRestrictedPos(): { [creepName: string]: string } {
        return this.memory.restrictedPos || {};
    }
    public addRestrictedPos(creepName: string, pos: RoomPosition): void {
        if (!this.memory.restrictedPos) this.memory.restrictedPos = {};

        this.memory.restrictedPos[creepName] = this.serializePos(pos);
    }
    public removeRestrictedPos(creepName: string): void {
        if (!this.memory.restrictedPos) this.memory.restrictedPos = {};

        delete this.memory.restrictedPos[creepName];
    }
}
