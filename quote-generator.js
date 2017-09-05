$(document).ready(()=>{App.init()});

var App = {
    init: () => {
        App.setEvents();
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
            if(data.quoteAuthor){
                $("#author b").html(`~ ${data.quoteAuthor}`);
                redditWrap.searchByAuthor(data.quoteAuthor);
            }
            else{
                $("#author b").html("~ Anonymous");
                View.clearFeed();
            }
        });
    },

    generateFeed: (title, url, term) => {

        if(redditWrap.filterTitle(title, term)){
            var entryStr = `
                <li>
                    <a href="${url}">${title}</a>
                </li>
            `;

            $("#redditFeed").append(entryStr);
        }
    },

    clearFeed: () => {
        $("#redditFeed").empty();
    }
}

var redditWrap = {
    endpoint: "https://www.reddit.com",

    searchByAuthor: (author) => {
        var title = author.trim().split(" ").join("+");
        var searchURL = `https://www.reddit.com/r/quotes/search.json?q=${title}&sort=popular&limit=30`;

        var data = redditWrap.grabJSON(searchURL);
        View.clearFeed(); //clear feed for regenerating
        data.then((obj)=>{
            var filtered = redditWrap.removeDups(obj.data.children);
            console.log(filtered)
            filtered.forEach((e)=>{
                View.generateFeed(e.data.title, e.data.url, author);
            })
        })
    },

    removeDups: (arr) => {
        return arr.filter((elem, i)=>{
            console.log(elem)
            return arr.indexOf(elem) === i;
        })
    },

    grabJSON: (url) => {
        return new Promise((resolve, reject)=>{
            $.getJSON(url, (data) => {resolve(data)});
        })
    },

    filterTitle: (title, searchTerm) =>{
        return title.includes(searchTerm) ? true : false;
    },
}
