import query from './query.gql';
import { SubtitleSearchForSeries, SubtitleSearchForSeriesVariables } from './__gen_gql/SubtitleSearchForSeries';
import { client } from '@/apolloClient';

export const searchQuery = async (variables: SubtitleSearchForSeriesVariables): Promise<SubtitleSearchForSeries> => {
  return client
    .query<SubtitleSearchForSeries, SubtitleSearchForSeriesVariables>({ query, variables })
    .then((r) => r.data);
};
