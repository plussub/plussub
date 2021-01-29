import { DocumentNode } from 'graphql';
import query from './query.gql';
import { LegacySubtitleSearch, LegacySubtitleSearchVariables } from './__gen_gql/LegacySubtitleSearch';
export {LegacySubtitleSearch_legacySubtitleSearch_entries} from './__gen_gql/LegacySubtitleSearch';

function getGqlString(doc: DocumentNode) {
  return doc.loc && doc.loc.source.body;
}

export const searchQuery = async (variables: LegacySubtitleSearchVariables): Promise<LegacySubtitleSearch> => {
  const result: { data: LegacySubtitleSearch } = await fetch('https://gqldev.plus-sub.com', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: getGqlString(query),
      variables
    })
  }).then((r) => r.json());

  return result.data;
};
