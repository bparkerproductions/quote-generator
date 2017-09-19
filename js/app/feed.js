var Feed = {

    searchByAuthor: (author) => {
        Data.currentAuthor = author;

        var title = author.trim().split(" ").join("+");
        var searchURL = `https://www.reddit.com/search.json?q=${title}&sort=popular&limit=100`;

        var data = Feed.grabJSON(searchURL);
        View.clearFeed(); //clear feed for regenerating

        Feed.generateFeed(data, author);
    },

    generateFeed: (data, author) => {
        data.then((obj)=>{
            var filtered = Feed.filterTitle(obj.data.children, author);
            Data.currentFeed = filtered;
            var pagenate = Feed.pagenate(filtered, 5);
            pagenate.forEach((e)=>{
                View.generateFeedElem(e.data.title, e.data.url, Data.currentAuthor);
            })
        });
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
        var data = Feed.pagenate(Data.currentFeed, amount);
        data.forEach((e)=>{
            View.generateFeedElem(e.data.title, e.data.url, Data.currentAuthor);
        });
    }
}