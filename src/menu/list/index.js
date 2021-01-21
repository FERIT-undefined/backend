const Meal = require('../schema');
const Joi = require('joi');

async function listAllMeals(req, res) {

    let allMeals = await Meal.find({});

    try {

        if(allMeals.length == 0) return res.status(404).json({ error: 'There are no meals in a database' });
        allMeals = allMeals.map((meal) => {

            return {
                id: meal.id,
                name: meal.name,
                description: meal.description,
                price: meal.price,
                type: meal.type,
                pdv: meal.pdv,
                discount: meal.discount
            };
        });
        return res.status(200).json({ allMeals });
    }
    catch(err) {
        return res.status(500).json({ error: err });
    }
}

async function listByMealId(req, res) {

    const validatorParams = Joi.object({
        meal_id: Joi.string().required()
    });
    const resultParams = validatorParams.validate(req.params);

    if(resultParams.error) {
        return res.status(400).send(resultParams.error);
    }
    if(!resultParams.value.meal_id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send({ error: 'Invalid ObjectId' });
    }

    let meal = await Meal.findById(resultParams.value.meal_id);
    try {

        if(!meal) return res.status(404).json({ error: 'There are no meals with that ID in the database' });
        return res.status(200).json({ 
            'name': meal.name,
            'description': meal.description,
            'type': meal.type,
            'price': meal.price,
            'pdv': meal.pdv,
            'discount': meal.discount
        });
    }
    catch(err) {
        return res.status(500).json({ error: err });
    }
}

exports.listAllMeals = listAllMeals;
exports.listByMealId = listByMealId;