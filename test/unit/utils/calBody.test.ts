import { calcBodyPart } from '../../../src/utils';
import { assert } from "chai";

describe('计算creep身体', () => {
    it('1move', () => {
        const body = calcBodyPart({ ['move']: 1 });
        assert.isDefined(body)
        assert.equal(body.length,1)
        assert.includeMembers(body,['move'])
    });
});
