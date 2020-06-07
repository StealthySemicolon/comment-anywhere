function setup(){
    let params = {
        active:true,
        currentWindow:true
    }
    chrome.tabs.query(params, title);
    function title(tabs)
    {
        var discussionTopic = "Discussion Topic"; // Get from Backend
        console.log("Discussion topic, loading")
        var topic = document.getElementById("disc");
        topic.textContent = discussionTopic;
        var comments = [["IpadPro","COOL","June 6 2020"],["Aang","Flameo Hotman", "June 9 2020"],["ILoveWater", "@Aang OMG is that an Avatar reference", "June 16 2020"],["YodaMaster","OMG I Love Avatar, June 17 2020"]]; //Get From Backend
        for(elm in comments){
            var div = document.getElementById("comments");
            var a = document.createElement('a');
            a.innerText = comments[elm][0] + "\n       " + comments[elm][1] + "      "+ comments[elm][2];
            div.appendChild(a); //ADDED JS CREATED TAG
    }}}
setup()
