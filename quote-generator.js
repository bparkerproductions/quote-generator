$(document).ready(()=>{App.init()});

var Data = {}
Data.feedPage = 1;
Data.currentFeed = "";
Data.currentAuthor = "";

var App = {
    init: () => {
        App.setEvents();
    },

    setEvents: () => {
        $("#generateQuote").on("click", View.generateQuote);
        $("#growFeed").on('click', View.growFeed);
    }
}

var View = {

    generateQuote: () => {
        var url = "http://api.forismatic.com/api/1.0/?method=getQuote&key=457653&format=jsonp&lang=en&jsonp=?";
        Data.feedPage = 1; //reset pagenation
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

    generateFeedElem: (title, url, term) => {

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
    },

    growFeed: () => {
        var amount = parseInt(Data.feedPage)*5;
        View.clearFeed();
        var data = redditWrap.pagenate(Data.currentFeed, amount);
        data.forEach((e)=>{
            View.generateFeedElem(e.data.title, e.data.url, Data.currentAuthor);
        });
        Data.feedPage++;
    }
}

var redditWrap = {

    searchByAuthor: (author) => {
        Data.currentAuthor = author;

        var title = author.trim().split(" ").join("+");
        var searchURL = `https://www.reddit.com/r/quotes/search.json?q=${title}&sort=popular&limit=100`;

        var data = redditWrap.grabJSON(searchURL);
        View.clearFeed(); //clear feed for regenerating
        data.then((obj)=>{
            Data.currentFeed = filtered;
            var filtered = redditWrap.removeDups(obj.data.children);
            var pagenate = redditWrap.pagenate(obj.data.children, 5);
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
        console.log(arr);
        console.log(amount);
        return arr.splice(1, amount);
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
