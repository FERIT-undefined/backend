const TableOrder = require('../schema');
const Meal = require('../../menu/schema');
const OrderTraffic = require('../../traffic/schema');
const Joi = require('joi');

const validatorBody = Joi.object({
    table: Joi.number().required(),
    total_price: Joi.number().required()
});

async function mealExport(req, res) {

    const resultBody = validatorBody.validate(req.body);
    if(resultBody.error) {
        return res.status(400).send(resultBody.error);
    }

    try {

        const order = await TableOrder.findOne({ table: resultBody.value.table });
        if(order == null) {
            return res.status(404).json({ status: 'Order not found in the database.' });
        }
        if(order.isFinished){
            order.total_price = resultBody.value.total_price;
            await TableOrder.findOneAndDelete({ table: resultBody.value.table });
            await insertOrderTraffic(order);
        }

        const tmpOrder = JSON.parse(JSON.stringify(order));
        return res.status(200).json({ tmpOrder });
    }
    catch(err) {
        return res.status(500).json({ error: err });
    }
}

async function insertOrderTraffic(orderData) {

    const trafficOrder = new OrderTraffic();
    trafficOrder.billId = orderData.id;
    trafficOrder.meals = [];

    for (const meal of orderData.meals) {
        const mealData = await Meal.findById(meal.id);
        const tmpObject = {
            'id': meal.id,
            'name': mealData.name,
            'description': mealData.description,
            'type': mealData.type,
            'price': mealData.price,
            'pdv': mealData.pdv,
            'discount': mealData.discount,
            'quantity': meal.quantity
        };
        trafficOrder.meals.push(tmpObject);
    }
    trafficOrder.total_price = orderData.total_price;
    trafficOrder.finished_timestamp = Date.now();
    return await trafficOrder.save();
}

module.exports = mealExport;