const TableOrder = require('../schema');
const User = require("../../users/schema");
const Joi = require('joi');
const orderStatus = require('../../_helpers/orderStatus');

const validatorParams = Joi.object({
    table: Joi.string().required(),
    meal: Joi.string().required()
});

const validatorBody = Joi.object({
    status: Joi.string().required()
});

async function edit(req, res) {

    const resultParams = validatorParams.validate(req.params);
    if(resultParams.error) {
        return res.status(400).send(resultParams.error);
    }

    const authorizedUser = await User.findOne({ refreshToken: data.refreshToken });
    if(!authorizedUser) {
        return res.status(403);
    }

    const resultBody = validatorBody.validate(req.body);
    if(resultBody.error) {
        return res.status(400).send(resultBody.error);
    }

    if(!orderStatus.isValidStatus(resultBody.value.status)) {
        return res.status(400).send('Invalid status');
    }

    try {
        const order = await TableOrder.findOne({ table: parseInt(resultParams.value.table) });
        const mealId = parseInt(resultParams.value.meal);

        order.meals[mealId].status = resultBody.value.status;
        if(order.meals[mealId].status == orderStatus.status.Done) {
            remove(order.meals, order.meals[mealId]);
        }

        order.markModified('meals');
        await order.save();

        if(order.meals.length <= 0) {
            await TableOrder.deleteOne({ table: parseInt(resultParams.value.table) });
        }

        return res.status(200).json({ status: 'Order status successfully edited' });
    }
    catch(err) {
        return res.status(500).json({ error: err });
    }
}

function remove(array, element) {
    const index = array.indexOf(element);
    array.splice(index, 1);
}

module.exports = edit;