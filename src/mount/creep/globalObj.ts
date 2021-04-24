//@ts-nocheck

import _ from 'lodash';
import { pushCarrierTask, pushSpawnTask } from 'mount/tasks/task.manager';
import { find } from '../structure/role.tower';
import { add, remove } from 'whiteList';
import {findScreepsBaseCenterPos} from 'autoPlan/planBasePos'
export default {
    buildRoadd(from: RoomPosition, to: RoomPosition) {
        buildRoad(from, to);
    },
    creep: {
        spawnNewCreep(body: number, type: string) {
            let task = `${type} ${body}`;
            if (
                Memory.spawnTask['Spawn1'].includes(task) ||
                global['spawnTask']['Spawn1'].includes(task)
            ) {
                return;
            }
            Memory.spawnTask['Spawn1'].unshift(task);
        }
    },
    find: find,
    remote: {
        addPassRoom(roomName: string): boolean {
            if (!Memory.bypassRooms) Memory.bypassRooms = [];
            if (Memory.bypassRooms.includes(roomName)) {
                return false;
            }
            Memory.bypassRooms.push(roomName);
            return true;
        },
        delPassRoom(roomName: string): boolean {
            if (!Memory.bypassRooms) Memory.bypassRooms = [];
            if (Memory.bypassRooms.includes(roomName)) {
                _.pull(roomName);
                return true;
            }
            return false;
        },
        scout(roomName: string) {
            if (Game.rooms[roomName]) {
                Game.rooms[roomName].sources.forEach((it) => {
                    it.pos.createFlag(`RemoteSource_${encodee(it.id)}`);
                });
            } else {
                let task = `Scout 1800 {"pos":{"x":20,"y":20,"name":"${roomName}"},"remoteSource":true}`;
                let name = 'Player';
                if (!Memory.spawnTask['Spawn1']) {
                    Memory.spawnTask['Spawn1'] = [];
                }
                if (!global['spawnTask']) {
                    global['spawnTask'] = {};
                }
                if (
                    Memory.spawnTask['Spawn1'].includes(task) ||
                    Object.values(global['spawnTask']).find((it) =>
                        it.includes(task)
                    )
                ) {
                    return;
                }
                console.log(
                    `<p style="color: #8BC34A;">[${name}]发布了任务：${task}</p>`
                );
                Memory.spawnTask['Spawn1'].unshift(task);
            }
        }
    },
    pushCarrierTaskk: pushCarrierTask,
    pushSpawnTaskk: pushSpawnTask,
    WhiteList: {
        add: add,
        remove: remove
    },
    findScreepsBaseCenterPos
};
