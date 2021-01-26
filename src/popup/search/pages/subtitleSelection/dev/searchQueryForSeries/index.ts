import query from './query.gql';
import { DocumentNode } from 'graphql';
import {
  SubtitleSearchForSeries,
  SubtitleSearchForSeries_subtitleSearch_data as SearchQueryResultEntry,
  SubtitleSearchForSeriesVariables
} from './__gen_gql/SubtitleSearchForSeries';

export { SearchQueryResultEntry };

function getGqlString(doc: DocumentNode) {
  return doc.loc && doc.loc.source.body;
}

export const searchQuery = async (variables: SubtitleSearchForSeriesVariables): Promise<SearchQueryResultEntry[]> => {
  const result: { data: SubtitleSearchForSeries } = await fetch('https://gqldev.plus-sub.com', {
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
