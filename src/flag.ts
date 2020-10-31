export function getReserverFirstAvailableFlag(): string {
    if (!Memory.ReserverRemoteSource) {
        Memory.ReserverRemoteSource = [];
    }
    return Object.keys(Game.flags).find((it) => {
        return (
            it.split('_')[0] == 'RemoteSource' &&
            !Memory.ReserverRemoteSource.includes(it)
        );
    });
}
export function setReserverUnavailableFlag(name: string) {
    if (!Memory.ReserverRemoteSource) {
        Memory.ReserverRemoteSource = [];
    }
    Memory.ReserverRemoteSource.push(name);
}
export function setReserverAvailableFlag(name: string) {
    if (!Memory.ReserverRemoteSource) {
        Memory.ReserverRemoteSource = [];
    }
    let index = Memory.ReserverRemoteSource.indexOf(name);
    if (index == -1) {
        return;
    }
    Memory.ReserverRemoteSource.splice(index, 1);
}
export function getMinerFirstAvailableFlag(): string {
    if (!Memory.MinerRemoteSource) {
        Memory.MinerRemoteSource = [];
    }
    return Object.keys(Game.flags).find((v) => {
        return (
            v.split('_')[0] == 'RemoteSource' &&
            !Memory.MinerRemoteSource.includes(v)
        );
    });
}
export function setMinerUnavailableFlag(name: string) {
    if (!Memory.MinerRemoteSource) {
        Memory.MinerRemoteSource = [];
    }
    Memory.MinerRemoteSource.push(name);
}
export function setMinerAvailableFlag(name: string) {
    if (!Memory.MinerRemoteSource) {
        Memory.MinerRemoteSource = [];
    }
    let index = Memory.MinerRemoteSource.indexOf(name);
    if (index == -1) {
        return;
    }
    Memory.MinerRemoteSource.splice(index, 1);
}
export function getScoutFirstAvailableFlag(): string {
    if (!Memory.ScoutRemoteSource) {
        Memory.ScoutRemoteSource = [];
    }
    return Object.keys(Game.flags).find((it) => {
        return (
            !Memory.ScoutRemoteSource.includes(it)
        );
    });
}
export function setScoutUnavailableFlag(name: string) {
    if (!Memory.ScoutRemoteSource) {
        Memory.ScoutRemoteSource = [];
    }
    Memory.ScoutRemoteSource.push(name);
}
export function setScoutAvailableFlag(name: string) {
    if (!Memory.ScoutRemoteSource) {
        Memory.ScoutRemoteSource = [];
    }
    let index = Memory.ScoutRemoteSource.indexOf(name);
    if (index == -1) {
        return;
    }
    Memory.ScoutRemoteSource.splice(index, 1);
}