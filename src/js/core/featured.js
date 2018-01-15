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
        contentType: "Video",
        title: "Dread King Dave // The Beginning",
        desc: "Check out the latest montage from Dread King Dave composed of some of his hottest Destiny 2 clips.",
        url: "https://www.youtube.com/watch?v=VcAqrOZWI6M",
        imgPath: "img/featImg-DKD.jpg",
        icon: "video-camera"
    };
    var templateSource = $('#js-feat-template').html();
    var compiledTemplate = Handlebars.compile(templateSource);
    $('.js-feat-wrap').prepend(compiledTemplate(featData));
});


