getTwoChar = function(integer) {
    result = '' + parseInt(integer / 10) % 10 + integer % 10;
    return result;
}
