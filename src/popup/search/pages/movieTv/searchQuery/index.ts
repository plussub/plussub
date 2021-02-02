import query from './query.gql';
import { VideoSearch, VideoSearch_videoSearch_entries as SearchQueryResultEntry, VideoSearchVariables } from './__gen_gql/VideoSearch';

import { client } from '@/apolloClient';

export { SearchQueryResultEntry };

export const searchQuery = async (variables: VideoSearchVariables): Promise<SearchQueryResultEntry[]> => {
  if (variables.query === '') {
    return [];
  }
  const result = await client
    .query<VideoSearch, VideoSearchVariables>({ query, variables })
    .then((r) => r.data);
  return result.videoSearch.entries;
};
