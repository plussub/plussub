import query from './query.gql';
import { VideoSearchQuery, VideoSearchQueryVariables } from './__gen_gql';
import { client } from '@/apolloClient';

export * from './__gen_gql';

export const searchQuery = async (variables: VideoSearchQueryVariables): Promise<VideoSearchQuery & {query: string}> => {
  return client
    .query<VideoSearchQuery, VideoSearchQueryVariables>({ query, variables })
    .then((r) => {
      return {
        query: variables.query,
        ...r.data
      };
    });
};
