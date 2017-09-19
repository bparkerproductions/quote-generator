var Quote = {
    setEvents: () => { 
        $("#generateQuote").on("click", Quote.generateQuote); 
    },

    generateQuote: () => {
        var url = "http://api.forismatic.com/api/1.0/?method=getQuote&key=457653&format=jsonp&lang=en&jsonp=?";
        View.reset();

        $.getJSON(url, (data)=>{
            $("#quote").html(data.quoteText);
            App.setTwitterQuote(data.quoteText, data.quoteAuthor);
            //render the quotes
            Quote.Views.renderQuote(data);
        });
        var author = $("#author").text().replace("~"," ");
    },

    Views: {
        renderQuote: (data) => {
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
        }
    }
}