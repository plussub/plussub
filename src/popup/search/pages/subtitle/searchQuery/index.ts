import query from './query.gql';
import { LegacySubtitleSearch, LegacySubtitleSearchVariables } from './__gen_gql/LegacySubtitleSearch';
import { client } from '@/apolloClient';

export { LegacySubtitleSearch_legacySubtitleSearch_entries } from './__gen_gql/LegacySubtitleSearch';

export const searchQuery = async (variables: LegacySubtitleSearchVariables): Promise<LegacySubtitleSearch> => {
  return client
    .query<LegacySubtitleSearch, LegacySubtitleSearchVariables>({ query, variables })
    .then((r) => r.data);
};
