import { FastifyRequest } from 'fastify';
import { chain, fold, left, right, Either } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { verify } from 'jsonwebtoken';
import { path } from 'ramda';
import { DeepReadonly } from 'ts-essentials';

type Token = { readonly [key: string]: string };
type TokenContext = { readonly token: Token | null };

function getAuthorization(
  request: DeepReadonly<FastifyRequest>
): Either<null, string> {
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

function getTokenContext(request: DeepReadonly<FastifyRequest>): TokenContext {
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

export const authentication = (
  request: DeepReadonly<FastifyRequest>
): TokenContext => {
  return { ...getTokenContext(request) };
};
