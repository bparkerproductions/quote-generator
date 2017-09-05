$(document).ready(()=>{App.init()});

var App = {
    init: () => {
        App.setEvents();
        //redditWrap.searchByAuthor();
    },

    setEvents: () => {
        $("button").on("click", View.generateQuote);
    }
}

var View = {

    generateQuote: () => {
        var url = "http://api.forismatic.com/api/1.0/?method=getQuote&key=457653&format=jsonp&lang=en&jsonp=?";
        $.getJSON(url, (data)=>{
            $("#quote em").html(data.quoteText);
            $("#author b").html("~" + data.quoteAuthor);
        });
    }
}

var redditWrap = {
    endpoint: "https://www.reddit.com",

    searchByAuthor: () => {
        var searchURL = "https://www.reddit.com/r/quotes/search.json?q=Lucille+Ball&sort=popular&limit=100";
        var data = redditWrap.grabJSON(searchURL);
        data.then((obj)=>{
            obj.data.children.forEach((i)=>{
                redditWrap.viewData(i.data.title)
            })
        })
    },

    viewData: (data) => {
        console.log(data);
    },

    grabJSON: (url) => {
        return new Promise((resolve, reject)=>{
            $.getJSON(url, (data) => {resolve(data)});
        })
    }
}
