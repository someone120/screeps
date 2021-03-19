import { calcBodyPart } from '../../../src/utils';

it('1move', () => {
    const body = calcBodyPart({ ['move']: 1 });
    expect(body).toMatchObject(['move'])
});
