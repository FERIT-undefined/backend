const TableOrder = require('../schema');
const User = require('../../users/schema');
const OrderTraffic = require('../../traffic/schema');
const Meal = require('../../menu/schema');

const Joi = require('joi');
const orderStatus = require('../../_helpers/orderStatus');

const validatorParams = Joi.object({
    table: Joi.number().required(),
    meal: Joi.number().required()
});

const validatorBody = Joi.object({
    status: Joi.string().required()
});

async function edit(req, res) {

    delete req.body.accessToken;
    delete req.body.refreshToken;
    delete req.body.userId;

    const resultParams = validatorParams.validate(req.params);
    if(resultParams.error) {
        return res.status(400).send(resultParams.error);
    }

    const resultBody = validatorBody.validate(req.body);
    if(resultBody.error) {
        return res.status(400).send(resultBody.error);
    }

    if(!orderStatus.isValidStatus(resultBody.value.status.toLowerCase())) {
        return res.status(400).send({ error: 'Invalid status' });
    }

    try {
        const order = await TableOrder.findOne({ table: resultParams.value.table });
        const mealIndex = resultParams.value.meal;

        if(order == null){
            return res.status(404).json({ status: 'Order not found in the database.' });
        }
        
        if(mealIndex >= order.meals.length){
            return res.status(400).send({ error: 'Invalid meal ID' });
        }

        order.meals[mealIndex].status = resultBody.value.status;
        if(order.meals[mealIndex].status.toLowerCase() == orderStatus.status.Done.toLowerCase()) {
            const mealData = await Meal.findOne({ name: order.meals[mealIndex].name });
            if(!mealData) {
                return res.status(500).json({ status: 'Meal not found in the database.' });
            }

            await insertOrderTraffic(mealData);
            remove(order.meals, order.meals[mealIndex]);
        }

        order.markModified('meals');
        await order.save();
        if(order.meals.length <= 0) {
            await TableOrder.deleteOne({ table: resultParams.value.table });
        }

        return res.status(200).json({ status: 'Order status successfully edited' });
    }
    catch(err) {
        return res.status(500).json({ error: err });
    }
}

async function insertOrderTraffic(mealData) {

    const trafficOrder = new OrderTraffic();
    trafficOrder.name = mealData.name;
    trafficOrder.price = mealData.price;
    trafficOrder.type = mealData.type;
    trafficOrder.finished_timestamp = Date.now();

    return await trafficOrder.save();
}

function remove(array, element) {
    const mealIndex = array.indexOf(element);
    array.splice(mealIndex, 1);
}

module.exports = edit;