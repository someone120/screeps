import { assignPrototype } from 'utils';

export function freeSpaceCount(source: Source): number {
    if (source._freeSpaceCount == undefined) {
        if (Memory.freeSpaceCount == undefined) {
            let freeSpaceCount = 0;
            [source.pos.x - 1, source.pos.x, source.pos.x + 1].forEach((x) => {
                [source.pos.y - 1, source.pos.y, source.pos.y + 1].forEach(
                    (y) => {
                        if (
                            new RoomPosition(x, y, source.pos.roomName).lookFor(
                                LOOK_CREEPS
                            ).length > 0
                        )
                            freeSpaceCount++;
                    },
                    source
                );
            }, source);
            Memory.freeSpaceCount = freeSpaceCount;
        }
        source._freeSpaceCount = Memory.freeSpaceCount;
    }
    return source._freeSpaceCount;
}

export function mountSource() {
    Object.defineProperty(Room.prototype, 'sources', {
        get: function() {
            if (
                this._sources &&
                this._sources.lenght &&
                this._sources[0].energy <= 0
            ) {
                this._sources = undefined;
            }
            if (!this._sources) {
                this._sources = this.find(FIND_SOURCES_ACTIVE);
            }
            return this._sources;
        },
        enumerable: false,
        configurable: true
    });
}