$(document).ready(()=>{App.init()});

var Data = {}
Data.feedPage = 1;
Data.currentFeed = "";
Data.currentAuthor = "";

var App = {
    init: () => {
        App.setEvents();
        View.init();
    },

    setEvents: () => {
        $("#generateQuote").on("click", View.generateQuote);
        $("#growFeed").on('click', Feed.growFeed);
        $("#scroll-top").on('click', View.scrollTop);
    },

    setTwitterQuote: (quote, author) => {
        $('#tweet-button iframe').remove();

        var tweetBtn = $('<a></a>')
            .addClass('twitter-share-button')
            .attr('href', 'http://twitter.com/share')
            .attr('data-text', `${quote} ~ ${author}`)
            .attr('data-size', 'large');
        $('#tweet-button').append(tweetBtn);
        twttr.widgets.load();
    }
}

var View = {
    init: () => {
        $("#seeMore").hide();
    },

    generateQuote: () => {
        var url = "http://api.forismatic.com/api/1.0/?method=getQuote&key=457653&format=jsonp&lang=en&jsonp=?";
        View.reset();

        $.getJSON(url, (data)=>{
            $("#quote").html(data.quoteText);
            App.setTwitterQuote(data.quoteText, data.quoteAuthor);
            if(data.quoteAuthor){
                $("#author").html(`~ ${data.quoteAuthor}`);
                Feed.searchByAuthor(data.quoteAuthor);
                View.setAuthor(data.quoteAuthor);
            }
            else{
                $("#author").html("~ Anonymous");
                Feed.Views.clearFeed();
                View.hideButtons();
            }
        });
        var author = $("#author").text().replace("~"," ");
    },

    reset: () => {
        Data.feedPage = 1; //reset pagenation
        //put elements back
        $("#growFeed").show();
        $("#seeMore").show();
    },

    setAuthor: (author) => {
        $("#more-from-author").text(`See more from ${author}`)
    },

    hideButtons: () => {
        $("#growFeed").hide();
    },

    maxResults: () => {
        $("#growFeed").hide();
    },

    scrollTop: () => {
        $('html, body').animate({
            scrollTop: $("#instructions").offset().top
        }, 250);
    }

}

