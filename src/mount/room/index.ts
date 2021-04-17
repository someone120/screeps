import { assignPrototype } from 'GameUtils';
import RoomExtension from './ext';

export function mountRoom() {
    assignPrototype(Room, RoomExtension);
}
