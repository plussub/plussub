import query from './query.gql';
import { VideoSearch, VideoSearchVariables } from './__gen_gql/VideoSearch';
import { client } from '@/apolloClient';

export * from './__gen_gql/VideoSearch';

export const searchQuery = async (variables: VideoSearchVariables): Promise<VideoSearch> => {
  return client
    .query<VideoSearch, VideoSearchVariables>({ query, variables })
    .then((r) => r.data);
};
