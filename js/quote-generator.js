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
    },

    getFAClass: (url) => {
        //url is an img
        if(url.includes("i.redd.it") || url.includes("imgur.com")
            || url.includes("reddituploads")){
            return {"faClass":"picture-o", "title": "Image"}
        }
        //reddit self text
        else if(url.includes("www.reddit.com")){
            return {"faClass":"reddit-alien","title":"Reddit self text"};
        }
        //youtube
        else if(url.includes("youtube")){
            return {"faClass":"youtube-play","title":"Youtube video"};
        }
        //else, assume it's a website or blog post
        else{
            return {"faClass":"rss-square","title":"Blog post or website"};
        }
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
                View.setAuthor(data.quoteAuthor);
            }
            else{
                $("#author").html("~ Anonymous");
                View.clearFeed();
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

    generateFeedElem: (title, url) => {

            var faClass = App.getFAClass(url);

            var entryStr = `
                <li>
                    <i 
                        class="fa fa-${faClass.faClass}"
                        title="${faClass.title}">
                    </i>
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
    },

    scrollTop: () => {
        $('html, body').animate({
            scrollTop: $("#instructions").offset().top
        }, 250);
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
            console.log(obj.data.children);
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
