module.exports = {
    Ordered: 'ordered',
    Started: 'started',
    Done: 'done'
};

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
module.exports = getOrderStatus;