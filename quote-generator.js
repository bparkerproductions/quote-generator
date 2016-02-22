var Data = {
    url: "http://api.forismatic.com/api/1.0/?method=getQuote&key=457653&format=jsonp&lang=en&jsonp=?",

    fake_url: "f"
}

var App = {
    init: function(){
        View.generate_quote();
    },

}

var View = {

    generate_quote: function(){
        $.getJSON(Data.url, function(data){
            $("#quote em").html(data.quoteText);
            $("#author b").html("~" + data.quoteAuthor);
        });
    }
}

$(document).ready(function(){
    App.init();
});