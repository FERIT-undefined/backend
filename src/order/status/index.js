const TableOrder = require('../schema');

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

        if(checkIsOrderDone(order.meals)) {
            order.done = true
            await TableOrder.findByIdAndUpdate({ _id: order.id }, { isFinished: true});
        }

        return res.status(200).json({ status: 'Order status successfully edited' });
    }
    catch(err) {
        return res.status(500).json({ error: err });
    }
}

function checkIsOrderDone(meals) {
    let isDone = true
    meals.forEach(meal => {
        if(meal.status.toLowerCase() !== 'done') isDone = false
    });
    return isDone
}

module.exports = edit;