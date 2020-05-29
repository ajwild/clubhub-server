import { chain, fold, left, right, Either } from 'fp-ts/es6/Either';
import { pipe } from 'fp-ts/es6/pipeable';
import { verify } from 'jsonwebtoken';
import { path } from 'ramda';

type Token = { readonly [key: string]: string };
type TokenContext = { readonly token: Token | null };

function getAuthorization(request: any): Either<null, string> {
  const authorizationHeader = path<string>(
    ['headers', 'authorization'],
    request
  );
  return authorizationHeader ? right(authorizationHeader) : left(null);
}

function getToken(authorizationHeader: string): Either<null, string> {
  const [prefix, token] = authorizationHeader.split(' ');
  return prefix?.toLowerCase() === 'bearer' ? right(token) : left(null);
}

function verifyToken(token: string): Either<null, Token> {
  const verifiedToken = verify(token, 'TODO: secret') as Token;
  return verifiedToken ? right(verifiedToken) : left(null);
}

function getTokenContext(request: any): TokenContext {
  return pipe(
    right(request),
    chain(getAuthorization),
    chain(getToken),
    chain(verifyToken),
    fold(
      (_token: null): TokenContext => ({ token: null }),
      (token: Token): TokenContext => ({ token })
    )
  );
}

export const authentication = (_config: any) => {
  // eslint-disable-next-line max-params
  return async (root: any, args: any, ctx: any, info: any, next: any) => {
    const contextWithToken = {
      ...ctx,
      ...getTokenContext(root),
    };

    return next(root, args, contextWithToken, info);
  };
};
