import { buildRoad } from './util';
export default {
    buildRoadd(from: RoomPosition, to: RoomPosition) {
        buildRoad(from, to);
    },
    bot: {
        spawnNewCreep: function(body: number, type: string) {
            let task = `${type} ${body}`;
            if (
                Memory['spawnTask'].includes(task) ||
                global['spawnTask'] == task
            ) {
                return;
            }
            Memory['spawnTask'].unshift(task);
        }
    }
};
