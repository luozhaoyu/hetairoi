var trello;
init = function() {
    console.log('content.js initialized');
    var content_element = document.getElementsByTagName('body').item().textContent;
    trello = eval('(' + content_element + ')');
    trello_cards = trello.cards;
    for (var i in trello_cards) {
           console.log(trello_cards[i]['name'] + "\t");
    }
    console.log('done');
}

init();
