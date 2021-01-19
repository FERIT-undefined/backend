const TableOrder = require('../schema');
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

module.exports = edit;