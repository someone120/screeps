import {refreshGlobalMock} from "../unit/utils/mock/game";
import * as _ from "lodash";
import {pushCarrierTask} from "mount/tasks/task.manager";

refreshGlobalMock()
beforeEach(refreshGlobalMock)

it('全局环境测试', () => {
    // 全局应定义了 Game
    expect(Game).toBeDefined()
    // 全局应定义了 lodash
    expect(_).toBeDefined()
    // 全局的 Memory 应该定义且包含基础的字段
    expect(Memory).toMatchObject({ rooms: {}, creeps: {} })
})

it('发送任务',()=>{
    pushCarrierTask("test-a","a","b")
    pushCarrierTask("test-b","a","b",true)
    expect(Memory.rooms['a'].CarrierTask).toMatchObject(['test-b','test-a'])
})