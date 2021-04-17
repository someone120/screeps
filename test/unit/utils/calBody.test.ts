import { calcBodyPart } from '../../../src/GameUtils';

it('1move', () => {
    const body = calcBodyPart({ ['move']: 1 });
    expect(body).toMatchObject(['move'])
});
