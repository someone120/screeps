import { assignPrototype } from 'utils';
import RoomExtension from './ext';

export function mountRoom() {
    assignPrototype(Room, RoomExtension);
}
