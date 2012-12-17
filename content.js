onMessage = function(request, sender, sendResponse) {
    var content_element = document.getElementsByTagName('body').item().textContent;
    if (request['action'] == 'getContent')
        sendResponse({data: content_element});
    else
        document.write(request['data']);
}


init = function() {
    console.log('content.js initialized');
    chrome.extension.onMessage.addListener(onMessage);
}

init();
