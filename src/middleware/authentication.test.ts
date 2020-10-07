import { FastifyRequest } from 'fastify';
import { verify } from 'jsonwebtoken';
import { DeepReadonly } from 'ts-essentials';
import { mocked } from 'ts-jest/utils';

import { authentication } from './authentication';

jest.mock('jsonwebtoken', () => ({ verify: jest.fn() }));

const mockedVerify = mocked(verify);

describe('authentication', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns null token when authorization header is not provided', () => {
    expect.assertions(1);

    const request = {};

    const returnValue = authentication(request as DeepReadonly<FastifyRequest>);

    expect(returnValue).toStrictEqual({ token: null });
  });

  it('returns token when authorization header is provided', async () => {
    expect.assertions(1);

    const request = { headers: { authorization: 'Bearer abcdef' } };

    mockedVerify.mockImplementation(() => ({ abc: 'def' }));

    const returnValue = authentication(request as DeepReadonly<FastifyRequest>);

    expect(returnValue).toStrictEqual({ token: { abc: 'def' } });
  });
});
