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

            //if there are no results
            if(pagenate.length == 0){Feed.Views.generateEmptyView()}
                console.log(pagenate.length);
            if(filtered.length < 6){Feed.Views.hideSeeMore()}

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
            Feed.generateFeedElem(e.data.title, e.data.url, Data.currentAuthor);
        });
    },

    generateFeedElem: (title, url) => {
            var faClass = Feed.getFAClass(url);
            Feed.Views.appendFeedElement(faClass, url, title);
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

        generateEmptyView(){
            $("#more-from-author").text("");
            $("#growFeed").hide();
            $("#redditFeed").append("<p>No results found :(</p>");
        },

        hideSeeMore(){
            $("#growFeed").hide();
        }
    }
}