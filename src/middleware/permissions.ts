import { shield, rule, allow, deny, not, and } from 'graphql-shield';

const isAuthenticated = rule({ cache: 'contextual' })(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  (_parent, _args, ctx, _info) => {
    return ctx.user !== null;
  }
);

const isClubAdmin = rule({ cache: 'contextual' })(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  (_parent, _args, ctx, _info) => {
    return ctx.club.admins?.includes(ctx.user.id);
  }
);

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const isSameUser = rule({ cache: 'strict' })((_parent, args, ctx, _info) => {
  return ctx.user.id === args.id;
});

export const permissions = shield(
  {
    Query: {
      club: allow,
      clubs: allow,
      user: allow,
      users: allow,
    },
    Mutation: {
      createClub: isAuthenticated,
      deleteClub: and(isAuthenticated, isClubAdmin),
      updateClub: and(isAuthenticated, isClubAdmin),
      createUser: not(isAuthenticated),
      deleteUser: and(isAuthenticated, isSameUser),
      updateUser: and(isAuthenticated, isSameUser),
    },
    Club: allow,
    User: allow,
  },
  {
    fallbackRule: deny,
  }
);
