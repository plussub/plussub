import query from './query.gql';
import { SubtitleSearchForMoviesQuery, SubtitleSearchForMoviesQueryVariables } from './__gen_gql';
export * from './__gen_gql'
import { client } from '@/apolloClient';

export const searchQuery = async (variables: SubtitleSearchForMoviesQueryVariables): Promise<SubtitleSearchForMoviesQuery> => {
  return client
    .query<SubtitleSearchForMoviesQuery, SubtitleSearchForMoviesQueryVariables>({ query, variables })
    .then((r) => r.data);
};
