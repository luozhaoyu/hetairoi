function onMessage(request, sender, sendResponse) {
    var res;
    res = {
        'request': request,
        'sender': sender
    }
    filename = new Date().toISOString().replace(/[\.|:]/g, '') + '.' + request.split('.').pop();
    console.log(filename);
    chrome.experimental.downloads.download({saveAs: true, url: request, filename: filename}, function(x){console.log(x);});
    sendResponse(res);
}


onIconClicked = function(tab) {
    recieveData = function(response) {
        console.log(response)
    }

    console.log('browser onClick: ' + tab.id);
    var code = "return 'abc'";
//    var code = "document.getElementsByTagName('body').item().textContent";
//    chrome.tabs.executeScript(null, {"file": "content.js"}, recieveData);
    chrome.tabs.sendMessage(tab.id, {action: "getContent"}, recieveData);
}


function init() {
    console.log('then inited');
    chrome.browserAction.onClicked.addListener(onIconClicked);
}

init();
