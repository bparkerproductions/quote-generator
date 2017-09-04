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
            $("#author b").html("~" + data.quoteAuthor);
        });
    }
}
