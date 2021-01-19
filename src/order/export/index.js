const TableOrder = require('../schema');
const OrderTraffic = require('../../traffic/schema');
const Joi = require('joi');

const validatorBody = Joi.object({
    table: Joi.number().required()
});

async function mealExport(req, res) {

    const resultBody = validatorBody.validate(req.body);
    if(resultBody.error) {
        return res.status(400).send(resultBody.error);
    }

    try {

        const order = await TableOrder.findOneAndDelete({ table: resultBody.value.table });
        if(order == null) {
            return res.status(404).json({ status: 'Order not found in the database.' });
        }

        const tmpOrder = JSON.parse(JSON.stringify(order));
        await insertOrderTraffic(order);
        return res.status(200).json({ tmpOrder });
    }
    catch(err) {
        return res.status(500).json({ error: err });
    }
}

async function insertOrderTraffic(orderData) {

    const trafficOrder = new OrderTraffic();
    trafficOrder.billId = orderData.id;
    trafficOrder.meals = orderData.meals.map(meal => ({ 
        'name': meal.name, 
        'price': meal.price, 
        'quantity': meal.quantity })
    );
    trafficOrder.finished_timestamp = Date.now();
    return await trafficOrder.save();
}

module.exports = mealExport;