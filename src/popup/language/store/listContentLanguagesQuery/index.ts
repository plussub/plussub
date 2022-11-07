import query from './query.gql';
import { ListContentLanguagesQuery } from './__gen_gql';
import { client } from '@/apolloClient';

export * from './__gen_gql';

export const listContentLanguagesQuery = async (): Promise<ListContentLanguagesQuery> => {
  return client
    .query<ListContentLanguagesQuery>({ query })
    .then((r) => r.data);
};
