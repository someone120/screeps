export let workList: { [Type: string]: number } = {
  3: 3,
  1: 0,
  10: 0,
  11: 1,
  4: 0,
};
export function checkworkList() {
  if (Game.time % 50 == 0) {
    workList = {
      3: 3,
      1: 0,
      10: 0,
      11: 1,
      4: 0,
    };
    for (const key in Game.rooms) {
      if (Object.prototype.hasOwnProperty.call(Game.rooms, key)) {
        const it = Game.rooms[key];

        if (
          !(
            it.controller &&
            (it.controller.my ||
              (it.controller.reservation &&
                (it.controller.reservation.username == "someone120" ||
                  it.controller.reservation.username == "021enoemos")))
          )
        )
          break;
        workList[1] += Math.min(it.find(FIND_CONSTRUCTION_SITES).length, 2);
        workList[4] += Math.min(
          it.find(FIND_STRUCTURES, {
            filter: (it) => {
              return (
                it.hits < 100000 &&
                it.hitsMax - it.hits > 0 &&
                it.structureType != STRUCTURE_WALL
              );
            },
          }).length,
          2
        );
        workList[10] =
          Math.min(
            it.find(FIND_MINERALS)[0].pos.lookFor(LOOK_STRUCTURES).length,
            1
          ) + workList[10];
      }
    }
    console.log(JSON.stringify(workList));
  }
}
export function getWorkerCount() {
  let count = 0;
  Object.values(workList).forEach((it) => {
    count += it;
    console.log(it);
  });
  console.log(count);

  return count;
}
