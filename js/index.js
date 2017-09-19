$(document).ready(()=>{App.init()});

var Data = {}
Data.feedPage = 1;
Data.currentFeed = "";
Data.currentAuthor = "";

var App = {
    init: () => {
        App.setEvents();
        View.init();
        Quote.generateQuote();
    },

    setEvents: () => {
        Quote.setEvents();
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

