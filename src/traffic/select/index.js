const OrderTraffic = require('../schema');
const Joi = require('joi');

const validatorParams = Joi.object({
    start: Joi.string().required(),
    end: Joi.string().required()
});

async function select(req, res) {

    const resultParams = validatorParams.validate(req.params);
    if(resultParams.error) {
        return res.status(400).send(resultParams.error);
    }

    let traffic = await OrderTraffic.find({'finished_timestamp': {'$gte': new Date(resultParams.value.start).getTime(), '$lt': new Date(resultParams.value.end).getTime() }});
    try {

        if(traffic.length == 0) return res.status(404).json({ error: 'There are no traffic in a database in the given time range' });
        traffic = traffic.map((meal) => {

            return {
                name: meal.name,
                price: meal.price,
                type: meal.type
            };
        });
        return res.status(200).json({ traffic });
    }
    catch(err) {
        return res.status(500).json({ error: err });
    }
}

module.exports = select;