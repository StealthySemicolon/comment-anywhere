function setup(){
    let params = {
        active:true,
        currentWindow:true
    }
    chrome.tabs.query(params, gotTab);
    var username = "Chair"; // FROM BACKEND WHEN LOGINING
    function gotTab(tabs){
        console.log("Hello from Rithvik");
        console.log(tabs);
        var val = tabs[0].url
        if (val.length>= 71){
            Url.textContent = tabs[0].url.slice(0,70)+"...";
        }
        else{
            Url.textContent = tabs[0].url.slice(0,70);
        }
        //var discussions = ["Discussion 1\n","Discussion 2\n","Discussion 3\n","Discussion 4\n","Discussion 5\n"]; // Get From Backend
        var discussions = [["IpadPro","COOL","June 6 2020"],["Aang","Flameo Hotman", "June 9 2020"],["ILoveWater", "@Aang OMG is that an Avatar reference", "June 16 2020"],["YodaMaster","OMG I Love Avatar", "June 17 2020"]]; //Get From Backend
        // CREATING TEMPLATE
        for(elm in discussions){
            var div = document.getElementById("idDiscussions");
            var a = document.createElement('a');
            link = document.createTextNode(discussions[elm]);
            //a.setAttribute("href","discussionpage.html");
            a.innerText = (discussions[elm][0] + "\n" + discussions[elm][1] + "\n" + discussions[elm][2] + "\n");
            div.appendChild(a); //ADDED JS CREATED TAG
        }//DONE WITH CREATION
    }
    window.onclick = function(event){
        var target = event.target;
        if (target.matches('.submit-button')){
            var div = document.getElementById("idDiscussions");
            var a = document.createElement('a');
            //a.setAttribute("href","discussionpage.html");
            var text = document.getElementById("commentbox").value;
            var date = new Date();
            var day = date.getDate()
            var month = date.getMonth()
            var months = [ "January", "February", "March", "April","May", "June", "July", "August", "September", "October", "November", "December" ]
            var year = date.getFullYear()
            fullDate = (day+" "+months[month]+" "+ year)
            if (text.replace(/\s/g,'').length != 0) 
            {
                a.innerText = (username + "\n" + document.getElementById("commentbox").value+ "\n" + fullDate);
                div.appendChild(a);
            }
            document.getElementById("commentbox").value = "";
        }
    }
    // Get from Backend------
    // Declare Array
    // Hardcode discussions
    // Once got ----
    //Loop through them and display them on the webpage in a list of hrefs



}
setup() 