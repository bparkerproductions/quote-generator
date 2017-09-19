var Feed = {

    searchByAuthor: (author) => {
        Data.currentAuthor = author;

        var title = author.trim().split(" ").join("+");
        var searchURL = `https://www.reddit.com/search.json?q=${title}&sort=popular&limit=100`;

        var data = Feed.grabJSON(searchURL);
        Feed.Views.clearFeed(); //clear feed for regenerating

        Feed.generateFeed(data, author);
    },

    generateFeed: (data, author) => {
        data.then((obj)=>{
            var filtered = Feed.filterTitle(obj.data.children, author);
            Data.currentFeed = filtered;
            var pagenate = Feed.pagenate(filtered, 5);
            pagenate.forEach((e)=>{
                Feed.generateFeedElem(e.data.title, e.data.url, Data.currentAuthor);
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
        Feed.Views.clearFeed();
        var data = Feed.pagenate(Data.currentFeed, amount);
        data.forEach((e)=>{
            View.generateFeedElem(e.data.title, e.data.url, Data.currentAuthor);
        });
    },

    generateFeedElem: (title, url) => {
            var faClass = App.getFAClass(url);
            Feed.Views.appendFeedElement(faClass, url, title);
    },

    Views:{
        appendFeedElement: (faClass, url, title) => {
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
    }
}