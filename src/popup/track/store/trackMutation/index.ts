import mutation from './mutation.gql';
import { client } from '@/apolloClient';

export interface Payload {
  source: 'file'  | 'search-for-movie' | 'search-for-series' | 'legacy-search';
  language: string;
}

export const trackMutation = async ({source, language}: Payload): Promise<unknown> => {
  return client.mutate({
    mutation,
    variables: {
      origin: window.location.origin,
      source,
      language
    }
  });
};
