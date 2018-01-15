/**
 * RSS.js
 * Scripting using YQL to retrieve rss feed from news site.
 * @license -
 * @version 0.0beta
 * @author  hyprEVO Engineering : Lance Porter
 */
//RSS feed

//Helper function to extract img from rss content
//needed for Gameinformer feed..not so for gamespot feed but gs feed not reliable
Handlebars.registerHelper('extractURL', function (url) {
    var tmp = document.createElement('div');
    tmp.innerHTML = url;
    var elem = tmp.getElementsByTagName('img')[0];
    return elem['src'];
});
function injectScript(url) {
    var scriptElement = document.createElement('script');
    scriptElement.setAttribute('type', 'text/javascript');
    scriptElement.setAttribute('src', url);
    document.getElementsByTagName('head')[0].appendChild(scriptElement);
}
function handleResponse(response) {
    //Number or results path
    //response.query.results.feed.entry.length

    //Log response
    console.log(response);

    //Handlebars
    var data = response.query.results.feed.entry;
    var cleanData = data.slice(0, 3); //just first 3
    var templateSource = document.getElementById('js-newsLink-template').innerHTML;
    var compiledTemplate = Handlebars.compile(templateSource);
    document.getElementById('js-newsLink-wrap').innerHTML = compiledTemplate(cleanData);


    console.log(cleanData);


}
//When HTML loads...
document.addEventListener("DOMContentLoaded", function () {
    // https://developer.yahoo.com/yql/console/
    //JSON encoded RSS feed URL
    var GSjson = "'https%3A%2F%2Fwww.gamespot.com%2Ffeeds%2Fnews%2F'";
    var GIjson = "'http%3A%2F%2Fwww.gameinformer.com%2Fb%2Fmainfeed.aspx%3FTags%3Dnews'";
    var IGjson = "'http%3A%2F%2Ffeeds.ign.com%2Fign%2Fgames-articles%3Fformat%3Dxml'";
    var concatFeedUrl = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20feednormalizer%20where%20url%3D" + GIjson + "%20and%20output%3D'atom_1.0'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=handleResponse";

    injectScript(concatFeedUrl);
}, false);