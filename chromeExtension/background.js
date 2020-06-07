
console.log('background running');

chrome.browserAction.onClicked.addListener(buttonClicked);

function buttonClicked(tab) {
  let msg = {
    txt: "hello"
  }
  console.log(tab)
  chrome.tabs.sendMessage(tab.id, msg);
}