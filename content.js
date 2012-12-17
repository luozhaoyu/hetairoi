onMessage = function(request, sender, sendResponse) {
    aggregateCards = function(trello, list_id) {
        // filter useful cards info
        var trello_actions = trello.actions;
//        var trello_action;
//        for (var i in trello.actions) {
//            trello_action = trello.actions[i];
//            if (trello_action['data'].hasOwnProperty('card') && (trello_action['data']['card']['id'] == list_id)) {
//                trello_actions.push(trello_action);
//            }
//        }
        var trello_cards = [];
        for (var i in trello.cards) {
            if (trello.cards[i]['idList'] == list_id)
                trello_cards.push(trello.cards[i]);
        }
        try {
            var card_action_info = {};
            var card_id, card_type, card_date;
            for (var i in trello_actions) {
                try {
                    if (trello_actions[i]['data'].hasOwnProperty('card')) {
                        card_id = trello_actions[i]['data']['card']['id'];
                        card_type = trello_actions[i]['type'];
                        card_date = trello_actions[i]['date'];
                        if (card_action_info.hasOwnProperty(card_id)) {
                            card_action_info[card_id]['actions'].push({type: card_type, date: card_date});
                        } else {
                            card_action_info[card_id] = {actions: [{type: card_type, date: card_date}]};
                        }
                    }
                } catch(err) {
                    console.log(err);
                    continue;
                }
            }

            // handle trello cards
            var display = '<table>', name, labels;
            var pt;
            var actions;
            for (var i in trello_cards) {
                try {
                    display += '<tr>';
                    // name
                    name = trello_cards[i]['name'];
                    display += "<td>" + name + "</td>";
                    // points
                    pt = name.match(/\d+pt/g);
                    if ((pt != undefined) && (pt.length))
                        display += "<td>" + pt[0] + "</td>";
                    // labels
                    labels = trello_cards[i]['labels'];
                    for (var j in labels) {
                        display += "<td>" + labels[j]['name'] + "</td>";
                    }
                    // date
                    card_id = trello_cards[i]['id'];
                    if (card_action_info.hasOwnProperty(card_id) && (card_action_info[card_id]['actions'].length > 0)) {
                        actions = card_action_info[card_id]['actions'];
                        for (var j in actions) {
                            display += "<td>" + actions[j]['type'] + "</td>";
                        }
                    }
                    display += "</tr>";
                    console.log(name + labels);
                } catch(err) {
                    console.log(err);
                    continue;
                }
            }
            display += '</table>';
            document.body.innerHTML = display;
        } catch(err) {
            document.write("fail in parsing trello data...");
            console.log(err);
        }
    }

    getLatestDone = function(trello) {
        getDoneListId = function(trello, start_date, end_date) {
            var trello_lists = trello.lists;
            var list_pattern = new RegExp('Done\\[' + (start_date.getMonth() + 1).toString() + start_date.getDate() + '-' + (end_date.getMonth() + 1).toString() + end_date.getDate() + '\\]', 'i');
            for (var i in trello_lists) {
                if (list_pattern.test(trello_lists[i]['name'])) {
                    return trello_lists[i]['id'];
                }
            }
            return null;
        }
        var date = new Date();
        var start_date, end_date;
        start_date = new Date(date.getTime() - (7 + date.getDay() - 1) * 3600 * 24 * 1000);
        end_date = new Date(date.getTime() - (7 - 4 + date.getDay() - 1) * 3600 * 24 * 1000);

        var done_list_id = getDoneListId(trello, start_date, end_date);
        return aggregateCards(trello, done_list_id);
    }

    var html_content = document.getElementsByTagName('body').item().textContent;
    console.log(html_content.substring(0, 1000));
    var trello;
    try {
        trello = eval('(' + html_content + ')');
    } catch(err) {
        console.log(err);
        document.write("didn't find trello data or data error...");
        return;
    }
    var cards = getLatestDone(trello);
}


init = function() {
    console.log('content.js initialized');
    chrome.extension.onMessage.addListener(onMessage);
}

init();
