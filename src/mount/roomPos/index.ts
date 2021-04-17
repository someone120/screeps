import RoomPostionExtension from './ext'
import { assignPrototype } from 'GameUtils'

/**
 * 挂载 RoomPosition 拓展
 */
export default () => assignPrototype(RoomPosition, RoomPostionExtension)