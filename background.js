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
function init() {
    console.log('background inited');
    chrome.browserAction.onClicked.addListener(function() {
        console.log('browseraction, clicked');
    });
}

init();
