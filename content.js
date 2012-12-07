var trello;
init = function() {
    console.log('content.js initialized');
    var content_element = document.getElementsByTagName('body').item();
    trello = eval(content_element);
    console.log('trello' + trello);
}

init();
