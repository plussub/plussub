const query = `
query videoSearch($query: String!)
{
  videoSearch(query: $query){
    entries{
      id
      title
      overview
      poster_path
      release_date
    }
  }
}
`

export const searchRequest = async (queryParam) => {
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
