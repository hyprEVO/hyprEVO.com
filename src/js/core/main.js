/**
 * Main.js
 * Misc global scripting.
 *
 *
 * @license -
 * @version 0.0beta
 * @author  hyprEVO Engineering: Lance Porter
 *
 *
 */

//------------------METHODS------------------//

//Featured Post Object
var featData = {
    contentType: "SpecsOfTheFli",
    title: "hyprCLIPS // Destiny 2 ",
    desc: "#NeverGetsOld #Destiny2 #Bungie #hypREGIME #hyprEVO #hyprClips #Destiny #gaming #SpecsOfTheFli",
    url: "https://twitter.com/hyprEvo/status/954526479626526720",
    imgPath: "img/featImg-hClips.jpg",
    icon: "video-camera"
};

//Helper function to extract img path from rss content
Handlebars.registerHelper('extractURL', function (url) {
    var tmp = document.createElement('div');
    tmp.innerHTML = url;
    var elem = tmp.getElementsByTagName('img')[0];
    return elem['src'];
});

//Easy method for handlebars rendering
function doHandlebars(data, template, container, place) {
    var theTemplate = $(template).html();
    var compiledTemplate = Handlebars.compile(theTemplate);
    if (place === "prepend") {
        $(container).prepend(compiledTemplate(data));
    } else if (place === "append") {
        $(container).append(compiledTemplate(data));
    } else {
        $(container).html(compiledTemplate(data));
    }
    console.log("did handlebars");
}

//Easy method for encoding url then injecting needed YQL script to get feed
function loadFeed(url, key) {

    var encoded = encodeURIComponent(url);
    console.log('encoded', encoded);
    // https://developer.yahoo.com/yql/console/
    //JSON encoded RSS feed URL
    // var GSjson = "'https%3A%2F%2Fwww.gamespot.com%2Ffeeds%2Fnews%2F'";
    // var GIjson = "'http%3A%2F%2Fwww.gameinformer.com%2Fb%2Fmainfeed.aspx%3FTags%3Dnews'";
    // var IGjson = "'http%3A%2F%2Ffeeds.ign.com%2Fign%2Fgames-articles%3Fformat%3Dxml'";
    // var gplus = "'https%3A%2F%2Fgplusrss.com%2Frss%2Ffeed%2F401998a8df00674724fd89e57dc54d8e5a5fcbc8589f4'";

    var concatFeedUrl = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20feednormalizer%20where%20url%3D'" + encoded + "'%20and%20output%3D'atom_1.0'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=handleResponse" + key;

    injectScript(concatFeedUrl);

}

//Method that injects a script with proper dynamic ref using YQL to translate RSS into JSON
function injectScript(url) {
    var scriptElement = document.createElement('script');
    scriptElement.type = 'text/javascript';
    scriptElement.src = url;
    $('head').append(scriptElement);
}

//-- RSS RESPONSE METHODS --
//Methods used by inject script on how to handle the JSON response, includes key for different response

//MV Featured
function handleResponseMVfeat(response) {
    //Throwing MarzV feed into the featured slots for now
    var cleanData = response.query.results.feed.entry.slice(1, 4);
    doHandlebars(cleanData, "#js-MVnewsLink-template", "#js-newsLink-wrap", "html");
    return response;
}

//News feed
function handleResponseNews(response) {
    var cleanData = response.query.results.feed.entry.slice(0, 4);

    doHandlebars(cleanData, "#js-newsLink-template", ".js-news-wrap", "html");
}

//QC Youtube Feed
function handleResponseQCyt(response) {
    console.log("quesy", response.query.results.feed.entry);
    var cleanData = response.query.results.feed.entry;

    doHandlebars(cleanData.slice(0,5), "#js-vidListQC-template", ".js-vidQC-wrap", "append");
}

//MV Youtube Feed
function handleResponseMVyt(response) {
    console.log("quesy", response.query.results.feed.entry);
    var cleanData = response.query.results.feed.entry;

    doHandlebars(cleanData.slice(0,5), "#js-vidListMV-template", ".js-vidMV-wrap", "append");
}



//------------------DOC READY------------------//
$(document).ready(function () {

    loadFeed("http://www.gameinformer.com/b/mainfeed.aspx?Tags=news","News");
    loadFeed("http://www.marzvindicator.com/feeds/posts/default?alt=rss", "MVfeat");
    loadFeed("https://www.youtube.com/feeds/videos.xml?channel_id=UCNj11HAYuO0LaCKKGSGPL8g", "QCyt");
    loadFeed("https://www.youtube.com/feeds/videos.xml?channel_id=UCQkZLuIepmT7wCFGhE_1E_A", "MVyt");

    //Render feat post
    if (window.matchMedia("(min-width: 1668px)").matches) {
        doHandlebars(featData, "#js-feat-template", ".js-feat-wrap", "prepend");
    } else {
        doHandlebars(featData, "#js-feat-template-mob", ".js-feat-wrap", "prepend");
    }
    //Fix for ipad rendering, renders feat post depending on size
    $(window).on('resize', function () {
        if (window.matchMedia("(min-width: 1668px)").matches) {
            $('.main__contentBlock-content--feat').remove();
            if ($(".js-feat-desk").length < 1) {
                doHandlebars(featData, "#js-feat-template", ".js-feat-wrap", "prepend");
            }
        } else {
            $('.main__contentBlock-content--feat').remove();
            doHandlebars(featData, "#js-feat-template-mob", ".js-feat-wrap", "prepend");
            if ($(".js-feat-mob").length < 1) {
                doHandlebars(featData, "#js-feat-template-mob", ".js-feat-wrap", "append");
            }
        }
    });

});