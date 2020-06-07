function setup(){
    let params = {
        active:true,
        currentWindow:true
    }
    chrome.tabs.query(params, gotTab);

    function gotTab(tabs){
        console.log("Hello from Rithvik");
        console.log(tabs);
        Url.textContent = tabs[0].url.slice(0,20) + "...";// CHANGE------------------------------------------->
        var discussions = ["Discussion 1\n","Discussion 2\n","Discussion 3\n","Discussion 4\n","Discussion 5\n"];
        // CREATING TEMPLATE
        for(elm in discussions){
            var div = document.getElementById("idDiscussions");
            var a = document.createElement('a');
            link = document.createTextNode(discussions[elm]);
            a.setAttribute("href","https://www.github.com");
            a.innerText = discussions[elm];
            div.appendChild(a); //ADDED JS CREATED TAG
        }//DONE WITH CREATION
    }
    function createTemplate(discussions,elm){
        }
    // Get from Backend------
    // Declare Array
    // Hardcode discussions
    // Once got ----
    //Loop through them and display them on the webpage in a list of hrefs



}
setup() 