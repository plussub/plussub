import query from './query.gql';
import { DocumentNode } from 'graphql';
import {
  SubtitleSearchForMovies,
  SubtitleSearchForMovies_subtitleSearch_data as SearchQueryResultEntry,
  SubtitleSearchForMoviesVariables
} from './__gen_gql/SubtitleSearchForMovies';

export { SearchQueryResultEntry };

function getGqlString(doc: DocumentNode) {
  return doc.loc && doc.loc.source.body;
}

export const searchQuery = async (variables: SubtitleSearchForMoviesVariables): Promise<SearchQueryResultEntry[]> => {
  const result: { data: SubtitleSearchForMovies } = await fetch('https://gqldev.plus-sub.com', {
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
