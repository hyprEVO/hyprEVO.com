/**
 * Featured.js
 * Misc global scripting.
 * - Featured post handlebars object and compilation
 *
 * @license -
 * @version 0.0beta
 * @author  hyprEVO Engineering: Lance Porter
 *
 *
 */
$(document).ready(function () {
    //Featured Post
    var featData = {
        contentType: "hyprClip",
        title: "Dissidia Final Fantasy NT - MarzVindicator",
        desc: "Kill it with fire...#TopGoon #BattleRoyale #FinalFantasy #Dissidia #DissidiaNT #SquareEnix #PS4 #hyprEVO #hyprClips #gaming ⠀GT: MarzVindicator",
        url: "https://twitter.com/hyprEvo/status/953082892971859968",
        imgPath: "img/featImg-hClips.jpg",
        icon: "video-camera"
    };
    var templateSource = $('#js-feat-template').html();
    var compiledTemplate = Handlebars.compile(templateSource);
    $('.js-feat-wrap').prepend(compiledTemplate(featData));
});

 
