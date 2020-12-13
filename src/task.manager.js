"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.request = exports.carry = exports.transfer = exports.pushSpawnTask = exports.pushCarrierTask = void 0;
var task = /** @class */ (function () {
    function task() {
    }
    task.prototype.run = function (creep, text) {
        var split = text.split(' ');
        var structure = Game.getObjectById(split[1]);
        if (!structure) {
            finishTask(creep);
            return false;
        }
        return true;
    };
    return task;
}());
/**
 * 向任务列表中推送任务
 * @param task 任务
 */
function pushCarrierTask(task, name) {
    if (!Memory.porterTasker) {
        Memory.porterTasker = [];
    }
    if (!(Memory.porterTasker.includes(task) ||
        global.porterTasksTaken.includes(task))) {
        console.log("<p style=\"color: #8BC34A;\">[" + name + "]\u53D1\u5E03\u4E86\u4EFB\u52A1\uFF1A" + task + "</p>");
        Memory.porterTasker.push(task);
    }
}
exports.pushCarrierTask = pushCarrierTask;
/**
 * 向任务列表中推送任务
 * @param task 任务
 */
function pushSpawnTask(task, name) {
    if (!Memory.spawnTask) {
        Memory.spawnTask = {};
    }
    if (!Memory.spawnTask[name]) {
        Memory.spawnTask[name] = [];
    }
    if (!global.spawnTask) {
        global.spawnTask = {};
    }
    if (!(Memory.spawnTask[name].includes(task) ||
        global.spawnTask[name] == task)) {
        console.log("<p style=\"color: #8BC34A;\">[" + name + "]\u53D1\u5E03\u4E86\u4EFB\u52A1\uFF1A" + task + "</p>");
        Memory.spawnTask[name].push(task);
    }
}
exports.pushSpawnTask = pushSpawnTask;
function finishTask(creep) {
    var index = global.porterTasksTaken.indexOf(creep.memory['parentTask']);
    if (index != -1)
        global.porterTasksTaken.splice(index, 1);
    creep.memory['parentTask'] = null;
    global[creep.name] = -1;
}
var transfer = /** @class */ (function (_super) {
    __extends(transfer, _super);
    function transfer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    transfer.prototype.run = function (creep, text) {
        var split = text.split(' ');
        var structure = Game.getObjectById(split[1]);
        if (!_super.prototype.run.call(this, creep, text)) {
            finishTask(creep);
            return false;
        }
        if (creep.withdraw(structure, split[2]) ==
            ERR_NOT_IN_RANGE &&
            creep.store.getFreeCapacity() > 0) {
            creep.goTo(structure.pos);
        }
        else {
            finishTask(creep);
        }
        return true;
    };
    return transfer;
}(task));
exports.transfer = transfer;
var carry = /** @class */ (function (_super) {
    __extends(carry, _super);
    function carry() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    carry.prototype.run = function (creep, text) {
        var split = text.split(' ');
        var storage = Game.structures[split[1]];
        if (!global[creep.name])
            global[creep.name] = 0;
        if (global[creep.name] == 0)
            creep.memory['getting'] = true;
        global[creep.name]++;
        if (creep.memory['getting']) {
            if (!storage) {
                creep.memory['getting'] = false;
            }
            else {
                if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.goTo(storage.pos);
                }
                else {
                    creep.memory['getting'] = false;
                }
            }
        }
        else {
            var targets = Game.spawns[split[2]];
            if (creep.store[RESOURCE_ENERGY] > 0) {
                var result = creep.transfer(targets, RESOURCE_ENERGY);
                if (result == ERR_NOT_IN_RANGE) {
                    creep.goTo(targets.pos);
                }
                else if (result == ERR_FULL) {
                    finishTask(creep);
                }
            }
            else {
                finishTask(creep);
            }
        }
        return true;
    };
    return carry;
}(task));
exports.carry = carry;
var request = /** @class */ (function (_super) {
    __extends(request, _super);
    function request() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    request.prototype.run = function (creep, text) {
        var split = text.split(' ');
        var storage = Game.structures[split[1]];
        if (!global[creep.name])
            global[creep.name] = 0;
        if (global[creep.name] == 0)
            creep.memory['getting'] = true;
        global[creep.name]++;
        if (creep.memory['getting'] && creep.store[RESOURCE_ENERGY] < 50) {
            if (!storage) {
                creep.memory['getting'] = false;
                return;
            }
            if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.goTo(storage.pos);
            }
            else {
                creep.memory['getting'] = false;
            }
        }
        else {
            var targets = Game.structures[split[2]];
            if (targets.store &&
                targets.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                finishTask(creep);
                return;
            }
            if (creep.store[RESOURCE_ENERGY] > 0) {
                var result = creep.transfer(targets, RESOURCE_ENERGY);
                if (result == ERR_NOT_IN_RANGE) {
                    creep.goTo(targets.pos);
                }
                else if (result == ERR_FULL) {
                    finishTask(creep);
                }
            }
            else {
                finishTask(creep);
            }
        }
        return true;
    };
    return request;
}(task));
exports.request = request;
