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
        console.log(response.data);
//        var trello = eval('(' + response.data + ')');
//        var trello_cards = trello.cards;
//        for (var i in trello_cards) {
//               console.log(trello_cards[i]['name'] + "\t");
//        }
        chrome.tabs.sendMessage(tab.id, {action: "display", data: response.data + 'hahaha'});
    }

    console.log('browser onClick: ' + tab.id);
//    var code = "document.body.bgColor='red'";
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
