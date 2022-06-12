import query from './query.gql';
import { SubtitleSearchForSeriesQuery, SubtitleSearchForSeriesQueryVariables } from './__gen_gql';
import { client } from '@/apolloClient';

export * from './__gen_gql'

export const searchQuery = async (variables: SubtitleSearchForSeriesQueryVariables): Promise<SubtitleSearchForSeriesQuery> => {
  return client
    .query<SubtitleSearchForSeriesQuery, SubtitleSearchForSeriesQueryVariables>({ query, variables })
    .then((r) => r.data);
};
