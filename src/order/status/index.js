const TableOrder = require('../schema');
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
        order.markModified('meals');
        order.save();

        return res.status(200).json({ status: 'Order status successfully edited' });
    }
    catch(err) {
        return res.status(500).json({ error: err });
    }
}

module.exports = edit;