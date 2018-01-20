/**
 * Main.js
 * Misc global scripting.
 * - No-js remove class
 *
 * @license -
 * @version 0.0beta
 * @author  hyprEVO Engineering: Lance Porter
 *
 *
 */

//Featured Post
var featData = {
    contentType: "hyprClip",
    title: "Destiny 2 - SpecsOfTheFli",
    desc: "#NeverGetsOld #Destiny2 #Bungie #hypREGIME #hyprEVO #hyprClips #Destiny #gaming ",
    url: "https://twitter.com/hyprEvo/status/954526479626526720",
    imgPath: "img/featImg-hClips.jpg",
    icon: "video-camera"
};

//RSS feed

//Helper function to extract img from rss content
//needed for Gameinformer feed..not so for gamespot feed but gs feed not reliable
Handlebars.registerHelper('extractURL', function (url) {
    var tmp = document.createElement('div');
    tmp.innerHTML = url;
    var elem = tmp.getElementsByTagName('img')[0];
    return elem['src'];
});

function doHandlebars(data, template, container, place) {
    var theTemplate = $(template).html();
    var compiledTemplate = Handlebars.compile(theTemplate);
    if (place === "append") {
        $(container).prepend(compiledTemplate(data));
    } else if (place === "prepend") {
        $(container).append(compiledTemplate(data));
    } else {
        $(container).html(compiledTemplate(data));
    }
    console.log("did handlebars");
}

//Method that injects a script with proper dynamic ref
function injectScript(url) {
    var scriptElement = document.createElement('script');
    scriptElement.type = 'text/javascript';
    scriptElement.src = url;
    $('head').append(scriptElement);
}

//Method ref'd by inject script on how to handle the JSON response
function handleResponse(response) {
    var cleanData = response.query.results.feed.entry.slice(1, 4);
    doHandlebars(cleanData, "#js-newsLink-template", "#js-newsLink-wrap", "html");
    return response;
}

//
function loadFeed(url) {

    var encoded = encodeURIComponent(url);
    console.log('encoded', encoded);
    // https://developer.yahoo.com/yql/console/
    //JSON encoded RSS feed URL
    // var GSjson = "'https%3A%2F%2Fwww.gamespot.com%2Ffeeds%2Fnews%2F'";
    // var GIjson = "'http%3A%2F%2Fwww.gameinformer.com%2Fb%2Fmainfeed.aspx%3FTags%3Dnews'";
    // var IGjson = "'http%3A%2F%2Ffeeds.ign.com%2Fign%2Fgames-articles%3Fformat%3Dxml'";
    // var gplus = "'https%3A%2F%2Fgplusrss.com%2Frss%2Ffeed%2F401998a8df00674724fd89e57dc54d8e5a5fcbc8589f4'";

    var concatFeedUrl = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20feednormalizer%20where%20url%3D'" + encoded + "'%20and%20output%3D'atom_1.0'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=handleResponse";

    injectScript(concatFeedUrl);
    console.log($("#js-catchData").val());
}


$(document).ready(function () {

    loadFeed("http://www.gameinformer.com/b/mainfeed.aspx?Tags=news");

    //Render feat post
    if (window.matchMedia("(min-width: 1668px)").matches) {
        doHandlebars(featData, "#js-feat-template", ".js-feat-wrap", "append");
    } else {
        doHandlebars(featData, "#js-feat-template-mob", ".js-feat-wrap", "append");
    }


    $(window).on('resize', function () {
        if (window.matchMedia("(min-width: 1668px)").matches) {
            $('.main__contentBlock-content--feat').remove();
            if ($(".js-feat-desk").length < 1) {
                doHandlebars(featData, "#js-feat-template", ".js-feat-wrap", "append");
            }
        } else {
            $('.main__contentBlock-content--feat').remove();
            doHandlebars(featData, "#js-feat-template-mob", ".js-feat-wrap", "append");
            if ($(".js-feat-mob").length < 1) {
                doHandlebars(featData, "#js-feat-template-mob", ".js-feat-wrap", "append");
            }
        }
    });


});