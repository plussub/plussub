/**
 * Created by sonste on 26.02.2016.
 */

srtPlayer.PopupInputSelectionRenderer = srtPlayer.PopupInputSelectionRenderer || (()=> {

        return {
            movie: {
                option: (item)=>
                '<div class="SelectMovieTitle"> <h3> <strong> ' + item.Title + ' </strong> </h3>'
                + '<div class="movieInfoContainer">'
                + '<div> <strong> Year:</strong> ' + item.Year + '</div>'
                + '<div> <strong> IMDB Rating:</strong> ' + item.imdbRating + '</div>'
                + '<div> <strong> Genre: </strong> ' + item.Genre + '  </div>'
                + '<div> <strong> Country:</strong> ' + item.Country + '  </div>'
                + '</div>'
                + '<div class="imdbPosterContainer">'
                + '<object class="imdbPoster img-thumbnail" data="' + item.Poster + '" type="image/png">'
                + '<img class="imdbPoster img-thumbnail" src="../icons/posterError.png" />'
                + '</object>'
                + '</div>'
                + '<div class="clear"> </div>'
                + '</div>'
            },
            language: {
                option: (item)=>"<div>" + item.iso639Name + "</div>"
            },
            subtitle: {
                option: (item) =>
                '<div class="SelectMovieTitle"> <h3> <strong> ' + item.movieTitle + ' </strong> </h3>'
                + '<div> <strong> Subtitle Language:</strong> ' + item.subtitleLanguage + '</div>'
                + '<div> <strong> Subtitle Rating:</strong> ' + item.subtitleRating + '</div>'
                + '</div>'
            }
        }
    })();