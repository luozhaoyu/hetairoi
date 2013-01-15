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
            var useful_cards = {}; // useful cards, not all the cards
            var pt, actions, name, labels;
            for (var i in trello_cards) {
                try {
                    card_id = trello_cards[i]['id'];
                    useful_cards[card_id] = {};
                    // name
                    name = trello_cards[i]['name'];
                    useful_cards[card_id]['name'] = name;
                    // points
                    pt = name.match(/\d+pt/g);
                    useful_cards[card_id]['pt'] = pt;
                    if ((pt != undefined) && (pt.length))
                        useful_cards[card_id]['pt'] = pt[0];
                    // labels
                    useful_cards[card_id]['labels'] = trello_cards[i]['labels'];
                    // date
                    if (card_action_info.hasOwnProperty(card_id) && (card_action_info[card_id]['actions'].length > 0)) {
                        useful_cards[card_id]['actions'] = card_action_info[card_id]['actions'];
                    }
                } catch(err) {
                    console.log(err);
                    continue;
                }
            }
            return useful_cards;
        } catch(err) {
            document.write("fail in parsing trello data...");
            console.log(err);
        }
    }

    getLatestDone = function(trello) {
        getDoneListInfo = function(trello, start_date, end_date) {
            var trello_lists = trello.lists;

            var period = getTwoChar(start_date.getMonth() + 1) + getTwoChar(start_date.getDate()) + '-' + getTwoChar(end_date.getMonth() + 1) + getTwoChar(end_date.getDate());
            var list_pattern = new RegExp('Done\\[' + period + '\\]', 'i');
            console.log(list_pattern);
            if (confirm("Are you sure to sort trello list: Done[" + period + "]?")) {
                for (var i in trello_lists) {
                    if (list_pattern.test(trello_lists[i]['name'])) {
                        console.log(trello_lists[i]['name']);
                        return trello_lists[i];
                    }
                }
            }
            return null;
        }
        var date = new Date();
        var start_date, end_date;
        var previous_monday;
        if (date.getDay() > 4)  // if after Friday, check this week
            previous_monday = date.getDay() - 1;
        else
            previous_monday = 7 + date.getDay() - 1;
        start_date = new Date(date.getTime() - (previous_monday) * 3600 * 24 * 1000);
        end_date = new Date(date.getTime() - (previous_monday - 4) * 3600 * 24 * 1000);

        var done_list_info = getDoneListInfo(trello, start_date, end_date);
        if (done_list_info)
            return aggregateCards(trello, done_list_info['id']);
        else {
            alert("Didn't find matched trello list");
            return null;
        }
    }

    displayCards = function(cards) {
        var display = '<table>';
        var labels;
        for (var c in cards) {
            display += '<tr>';
            display += "<td>" + cards[c]['name'] + "</td>";
            display += "<td>" + cards[c]['pt'] + "</td>";
            labels = cards[c]['labels'];
            for (var i in labels) {
                display += "<td>" + labels[i]['name'] + "</td>";
            }
            display += '</tr>';
        }
    
        display += '</table>';
        document.body.innerHTML = display;
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
    if (cards)
        displayCards(cards);
}


init = function() {
    console.log('content.js initialized');
    chrome.extension.onMessage.addListener(onMessage);
}

init();
