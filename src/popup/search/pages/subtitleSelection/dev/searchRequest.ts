export interface OpensubtitlesStateResponse {
  attributes: {
    subtitle_id: string;
    language: string;
    format: string | null;
    ratings: number;
    url: string;
    hearing_impaired: boolean;
    files: {
      file_id: number;
      file_name: string;
    }[];
  };
}

const query = `
query subtitleSearch($tmdb_id: String!, $language: String!, $season_number: Int, $episode_number: Int)
{
  subtitleSearch(tmdb_id: $tmdb_id, language: $language, season_number: $season_number, episode_number: $episode_number){
    data {
      attributes {
        subtitle_id
        language
        format
        ratings
        url
        hearing_impaired
        files {
          file_id
          file_name
        }
      }
    }
  }
}
`;

export const searchRequest = async (variables: { tmdb_id: string; language: string, season_number: number, episode_number: number }): Promise<OpensubtitlesStateResponse[]> => {
  return fetch('https://gqldev.plus-sub.com', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query,
      variables
    })
  })
    .then((r) => r.json())
    .then((r) => r?.data?.subtitleSearch?.data ?? []);
};
