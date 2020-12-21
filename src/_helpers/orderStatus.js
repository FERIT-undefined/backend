exports.status = {
    Ordered: 'ordered',
    Started: 'started',
    Done: 'done'
};

function isValidStatus(string) {
    if(string == 'ordered' || string == 'started' || string == 'done') {
        return true;
    }
    return false;
}

function getOrderStatus(string) {

    if(string == 'ordered') {
        return Ordered;
    }
    else if(string == 'started') {
        return Started;
    }
    else if(string == 'done') {
        return Done;
    }
}
exports.getOrderStatus = getOrderStatus;
exports.isValidStatus = isValidStatus;