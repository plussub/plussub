import query from './query.gql';
import { DocumentNode } from 'graphql';
import {
  SubtitleSearch,
  SubtitleSearch_subtitleSearch_data as SearchQueryResultEntry,
  SubtitleSearchVariables
} from './__gen_gql/SubtitleSearch';

export { SearchQueryResultEntry };

function getGqlString(doc: DocumentNode) {
  return doc.loc && doc.loc.source.body;
}

export const searchQuery = async (variables: SubtitleSearchVariables): Promise<SearchQueryResultEntry[]> => {
  const result: { data: SubtitleSearch } = await fetch('https://gqldev.plus-sub.com', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: getGqlString(query),
      variables
    })
  }).then((r) => r.json());

  return result.data.subtitleSearch.data;
};
