import {DocumentNode} from "graphql";
import query from './query.gql';
import {
  LegacySubtitleSearch,
  LegacySubtitleSearch_legacySubtitleSearch_entries as SearchQueryResultEntry
} from './__gen_gql/LegacySubtitleSearch';

export { SearchQueryResultEntry };


function getGqlString(doc: DocumentNode) {
  return doc.loc && doc.loc.source.body;
}

export const searchQuery = async (variables: {tmdb_id: string, language: string, media_type: string}): Promise<SearchQueryResultEntry[]> => {
  const result: { data: LegacySubtitleSearch} = await fetch('https://gqldev.plus-sub.com', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: getGqlString(query),
      variables
    })
  }).then(r => r.json());

  return result.data.legacySubtitleSearch.entries;
}
