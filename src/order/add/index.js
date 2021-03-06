const TableOrder = require('../schema');
const orderStatus = require('../../_helpers/orderStatus');
const Joi = require('joi');

const serializer = Joi.object({
    table: Joi.number().integer().required(),
    meals: Joi.array().required(),
    total_price: Joi.number().required()
});

async function add(req, res) {

    delete req.body.accessToken;
    delete req.body.refreshToken;
    delete req.body.userId;
    
    const result = serializer.validate(req.body);
    if(result.error) {
        return res.status(400).send(result.error);
    }

    const savedTableOrder = await TableOrder.findOne({ table: result.value.table });
    if(savedTableOrder) {
        return res.status(400).json({ error: 'Table already has order inserted' });
    }

    const newTableOrder = new TableOrder();
    newTableOrder.table = result.value.table;
    newTableOrder.meals = result.value.meals;

    newTableOrder.meals.forEach((meal) => {
        meal.status = orderStatus.status.Ordered;
    });

    newTableOrder.total_price = result.value.total_price;
    newTableOrder.created_timestamp = Date.now();

    try {
        await newTableOrder.save();
        return res.status(201).json({ status: 'Table order saved' });
    }
    catch(err) {
        return res.status(500).json({ error: err });
    }
}

module.exports = add;