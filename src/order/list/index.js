const TableOrder = require('../schema');
const Joi = require('joi');

async function listAll(req, res) {

    let allOrders = await TableOrder.find({});

    try {

        if(allOrders.length == 0) return res.status(404).json({ error: 'There are no orders in a database' });
        allOrders = allOrders.map((order) => {
            return {
                table: order.table,
                meals: order.meals,
                total_price: order.total_price
            };
        });
        return res.status(200).json({ allOrders });
    }
    catch(err) {
        return res.status(500).json({ error: err });
    }
}

async function listByTable(req, res) {

    const validatorParams = Joi.object({
        table: Joi.number().required()
    });
    const resultParams = validatorParams.validate(req.params);
    if(resultParams.error) {
        return res.status(400).send(resultParams.error);
    }

    let tableOrders = await TableOrder.find({ table: resultParams.value.table });

    try {

        if(tableOrders.length == 0) return res.status(404).json({ error: 'There are no orders in a database' });
        tableOrders = tableOrders.map((order) => {
            return {
                table: order.table,
                meals: order.meals,
                total_price: order.total_price
            };
        });
        return res.status(200).json({ tableOrders });
    }
    catch(err) {
        return res.status(500).json({ error: err });
    }
}

async function listByOrderMeal(req, res) {

    const validatorParams = Joi.object({
        table: Joi.number().required(),
        meal: Joi.number().required()
    });
    const resultParams = validatorParams.validate(req.params);
    if(resultParams.error) {
        return res.status(400).send(resultParams.error);
    }

    let tableOrder = await TableOrder.findOne({ table: resultParams.value.table });
    try {
        if(tableOrder == null) return res.status(404).json({ error: 'There are no orders in a database' });

        if(tableOrder.meals[resultParams.value.meal] == null) return res.status(404).json({ error: 'There are no meals for given meal number' });

        const returnValue = {
            table: tableOrder.table,
            meals: tableOrder.meals[resultParams.value.meal]
        };
        return res.status(200).json({ returnValue });
    }
    catch(err) {
        return res.status(500).json({ error: err });
    }
}

exports.listAll = listAll;
exports.listByTable = listByTable;
exports.listByOrderMeal = listByOrderMeal;