import { verify } from 'jsonwebtoken';
import { mocked } from 'ts-jest/utils';

import { authentication } from './authentication';

jest.mock('jsonwebtoken', () => ({ verify: jest.fn() }));

const mockedVerify = mocked(verify);

describe('authentication', () => {
  let auth: (
    root: Readonly<Record<string, unknown>>,
    args: Readonly<Record<string, unknown>>,
    ctx: Readonly<Record<string, unknown>>,
    info: Readonly<Record<string, unknown>>,
    next: () => any
  ) => Promise<void>;

  beforeEach(() => {
    auth = authentication({});
  });

  it('returns null token when authorization header is not provided', async () => {
    expect.assertions(2);

    const root = {};
    const args = {};
    const ctx = {};
    const info = {};
    const next = jest.fn();

    const returnValue = await auth(root, args, ctx, info, next);

    expect(next).toHaveBeenCalledWith(root, args, { token: null }, info);
    expect(returnValue).toBeUndefined();
  });

  it('something else', async () => {
    expect.assertions(2);

    const root = { headers: { authorization: 'Bearer abcdef' } };
    const args = {};
    const ctx = {};
    const info = {};
    const next = jest.fn();

    mockedVerify.mockImplementation(() => ({ abc: 'def' }));

    const returnValue = await auth(root, args, ctx, info, next);

    expect(next).toHaveBeenCalledWith(
      root,
      args,
      { token: { abc: 'def' } },
      info
    );
    expect(returnValue).toBeUndefined();
  });
});
