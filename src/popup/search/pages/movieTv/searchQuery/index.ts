import query from './query.gql';
import { VideoSearch, VideoSearchVariables } from './__gen_gql/VideoSearch';
import { client } from '@/apolloClient';

export * from './__gen_gql/VideoSearch';

export const searchQuery = async (variables: VideoSearchVariables): Promise<VideoSearch & {query: string}> => {
  return client
    .query<VideoSearch, VideoSearchVariables>({ query, variables })
    .then((r) => {
      return {
        query: variables.query,
        ...r.data
      };
    });
};
