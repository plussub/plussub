import {OpensubtitlesState} from "../../shared/appState";

const query = `
query subtitleSearch($tmdb_id: String!, $language: String!, $media_type: String!)
{
  subtitleSearch(tmdb_id: $tmdb_id, language: $language, media_type: $media_type){
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

export const searchRequest = async (variables: {tmdb_id: string, language: string, media_type: string}): Promise<{entries: OpensubtitlesState[]}> => {
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
