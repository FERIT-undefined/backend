const TableOrder = require('../schema');
const Joi = require('joi');

const validatorParams = Joi.object({
    id: Joi.string().required()
});

const validatorBody = Joi.object({
    table: Joi.number().integer().required(),
    meals: Joi.array().required(),
    total_price: Joi.number().required(),
    refreshToken: Joi.string().required()
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

    await TableOrder.findOneAndUpdate({ table: parseInt(resultParams.value.id) }, { table: resultBody.value.table, meals: resultBody.value.meals, total_price: resultBody.value.total_price });
    try {
        return res.status(200).json({ status: 'Order successfully edited' });
    }
    catch(err) {
        return res.status(500).json({ error: err });
    }
}

module.exports = edit;