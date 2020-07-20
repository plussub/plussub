const query = `
query subtitleSearch($tmdbId: String!, $language: String!, $mediaType: String!)
{
  subtitleSearch(tmdbId: $tmdbId, language: $language, mediaType: $mediaType){
    entries{
      SubFileName
      SubDownloadLink
      ZipDownloadLink
      SubtitlesLink
      SubRating
      SubFormat
      LanguageName
    }
  }
}
`

export const searchRequest = async (variables) => {
  return await fetch('https://plussub-gql-cf-worker.stefanbreitenstein.workers.dev', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query,
      variables
    })
  }).then(r => r.json());
}
