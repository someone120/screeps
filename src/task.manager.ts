class task {
    run(creep: Creep, text: String){
        let split = text.split(' ');
        let moveCreep = Game.creeps[split[1]];
        moveCreep.memory['request']=-1
    }
}

export class move extends task {
    run(creep: Creep, text: String) {
        super.run(creep,text)
        let split = text.split(' ');
        let moveCreep = Game.creeps[split[1]];
        if (moveCreep == null) {
            creep.memory['task'] = null;
        }
        let result = creep.pull(moveCreep);
        if (moveCreep.pos.isNearTo(parseInt(split[2]), parseInt(split[3]))) {
            creep.memory['task'] = null;
            moveCreep.memory['inPath'] = false;
        } else if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(moveCreep, {
                visualizePathStyle: { stroke: '#ffaa00' },
            });
        } else {
            moveCreep.move(creep);
            if (creep.pos.isNearTo(parseInt(split[2]), parseInt(split[3]))) {
                creep.move(
                    creep.room
                        .getPositionAt(parseInt(split[2]), parseInt(split[3]))
                        .getDirectionTo(moveCreep)
                );
            } else {
                creep.moveTo(
                    creep.room.getPositionAt(
                        parseInt(split[2]),
                        parseInt(split[3])
                    )
                );
            }
        }
    }
}

export class transfer implements task {
    run(creep: Creep, text: String) {
        let split = text.split(' ');
        let moveCreep = Game.creeps[split[1]];
        if (moveCreep == null) {
            //死亡了就当没发生过
            creep.memory['task'] = null;
        }
        let spawn = Game.spawns['Spawn1'];

        if (spawn.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            if (
                moveCreep.transfer(creep, RESOURCE_ENERGY) ==
                    ERR_NOT_IN_RANGE &&
                creep.store.getUsedCapacity() <= 0
            ) {
                creep.say('1');
                creep.moveTo(moveCreep, {
                    visualizePathStyle: { stroke: '#ffaa00' },
                });
            } else {
                let targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_TOWER ||
                                structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity
                        );
                    },
                });
                if (
                    creep.transfer(targets[0], RESOURCE_ENERGY) ==
                    ERR_NOT_IN_RANGE
                ) {
                    creep.moveTo(targets[0]);
                }
            }
        } else {
            if (
                moveCreep.transfer(creep, RESOURCE_ENERGY) ==
                    ERR_NOT_IN_RANGE &&
                creep.store.getUsedCapacity() <= 0
            ) {
                creep.moveTo(moveCreep, {
                    visualizePathStyle: { stroke: '#ffaa00' },
                });
            } else {
                if (
                    creep.transfer(spawn, RESOURCE_ENERGY) ==
                        ERR_NOT_IN_RANGE &&
                    creep.store.getUsedCapacity() > 0
                ) {
                    creep.moveTo(spawn, {
                        visualizePathStyle: { stroke: '#ffaa00' },
                    });
                } else {
                    moveCreep.memory['full'] = false;
                    creep.memory['task'] = null;
                }
            }
        }
    }
}
