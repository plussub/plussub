import query from './query.gql';
import { SubtitleSearchForMovies, SubtitleSearchForMoviesVariables } from './__gen_gql/SubtitleSearchForMovies';
export * from './__gen_gql/SubtitleSearchForMovies'
import { client } from '@/apolloClient';

export const searchQuery = async (variables: SubtitleSearchForMoviesVariables): Promise<SubtitleSearchForMovies> => {
  return client
    .query<SubtitleSearchForMovies, SubtitleSearchForMoviesVariables>({ query, variables })
    .then((r) => r.data);
};
