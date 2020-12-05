function setRoomStatus(roomName: string, status: boolean) {
	if (!Memory.rooms) Memory.rooms = {};
	if (!Memory.rooms[roomName]) Memory.rooms[roomName] = {};
	Memory.rooms[roomName].isLockByProtect = status;
}
export function lockRoom(roomName: string) {
	setRoomStatus(roomName, true);
}
export function unlockRoom(roomName: string) {
	setRoomStatus(roomName, false);
}
export function roomStat(roomName: string): boolean {
	if (Memory.rooms || Memory.rooms[roomName]) return false;
	return !!Memory.rooms[roomName].isLockByProtect;
}
