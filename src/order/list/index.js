const TableOrder = require('../schema');
const Joi = require('joi');

async function listAll(req, res) {

    let allOrders = await TableOrder.find({});

    try {

        if(!allOrders) return res.status(404).json({ error: 'There are no orders in a database' });
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
        table: Joi.string().required()
    });
    const resultParams = validatorParams.validate(req.params);
    if(resultParams.error) {
        return res.status(400).send(resultParams.error);
    }

    let tableOrder = await TableOrder.find({ table: resultParams.value.table });

    try {

        if(!tableOrder) return res.status(404).json({ error: 'There are no orders in a database' });
        tableOrder = tableOrder.map((order) => {
            return {
                table: order.table,
                meals: order.meals,
                total_price: order.total_price
            };
        });
        return res.status(200).json({ tableOrder });
    }
    catch(err) {
        return res.status(500).json({ error: err });
    }
}

async function listByOrderMeal(req, res) {

    const validatorParams = Joi.object({
        table: Joi.string().required(),
        meal: Joi.string().required()
    });
    const resultParams = validatorParams.validate(req.params);
    if(resultParams.error) {
        return res.status(400).send(resultParams.error);
    }

    let tableOrder = await TableOrder.findOne({ table: parseInt(resultParams.value.table) });
    try {
        if(!tableOrder) return res.status(404).json({ error: 'There are no orders in a database' });
        const returnValue = {
            table: tableOrder.table,
            meals: tableOrder.meals[parseInt(resultParams.value.meal)]
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