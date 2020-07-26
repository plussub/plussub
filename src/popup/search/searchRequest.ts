import {TmdbState} from "../../shared/appState";

const query = `
query videoSearch($query: String!)
{
  videoSearch(query: $query){
    entries{
      tmdb_id
      title
      overview
      poster_path
      release_date
      media_type
      vote_average
    }
  }
}
`

export const searchRequest = async (queryParam: string): Promise<{entries: TmdbState[]}> => {
  return await fetch('https://plussub-gql-cf-worker.stefanbreitenstein.workers.dev', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query,
      variables: {
        query: queryParam
      }
    })
  }).then(r => r.json());
}
