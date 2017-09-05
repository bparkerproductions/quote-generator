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
        $("#growFeed").on('click', redditWrap.growFeed);
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
                redditWrap.searchByAuthor(data.quoteAuthor);
            }
            else{
                $("#author").html("~ Anonymous");
                View.clearFeed();
                View.hideButtons();
            }
        });
    },

    reset: () => {
        Data.feedPage = 1; //reset pagenation

        //put elements back
        $("#growFeed").show();
        $("#seeMore").show();
    },

    generateFeedElem: (title, url, term) => {

            var entryStr = `
                <li>
                    <a target="_blank" href="${url}">${title}</a>
                </li>
            `;

            $("#redditFeed").append(entryStr);
    },

    clearFeed: () => {
        $("#redditFeed").empty();
    },

    hideButtons: () => {
        $("#growFeed").hide();
    },

    maxResults: () => {
        $("#growFeed").hide();
    }

}

var redditWrap = {

    searchByAuthor: (author) => {
        Data.currentAuthor = author;

        var title = author.trim().split(" ").join("+");
        var searchURL = `https://www.reddit.com/search.json?q=${title}&sort=popular&limit=100`;

        var data = redditWrap.grabJSON(searchURL);
        View.clearFeed(); //clear feed for regenerating
        data.then((obj)=>{
            var filtered = redditWrap.filterTitle(obj.data.children, author);
            Data.currentFeed = filtered;
            var pagenate = redditWrap.pagenate(filtered, 5);
            pagenate.forEach((e)=>{
                View.generateFeedElem(e.data.title, e.data.url, Data.currentAuthor);
            })
        })
    },

    removeDups: (arr) => {
        var filtered = arr.filter((elem, i)=>{
            return arr.indexOf(elem) === i;
        });

        Data.currentFeed = filtered; //set global feed object
        return filtered;
    },

    pagenate: (arr, amount) =>{
        return arr.slice(0,amount);
    },

    grabJSON: (url) => {
        return new Promise((resolve, reject)=>{
            $.getJSON(url, (data) => {resolve(data)});
        })
    },

    filterTitle: (arr, searchTerm) =>{
        searchTerm = searchTerm.toLowerCase();

        return arr.filter((elem)=>{
            elem = elem.data.title.toLowerCase();
            return elem.includes(searchTerm);
        }).reverse();
    },

    growFeed: () => {
        Data.feedPage++;
        var amount = parseInt(Data.feedPage)*5;
        if(amount > Data.currentFeed.length){
          View.maxResults();
        }
        View.clearFeed();
        var data = redditWrap.pagenate(Data.currentFeed, amount);
        data.forEach((e)=>{
            View.generateFeedElem(e.data.title, e.data.url, Data.currentAuthor);
        });
    }
}
