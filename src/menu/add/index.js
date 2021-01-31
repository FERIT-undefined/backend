const Meal = require('../schema');
const User = require('../../users/schema');
const Joi = require('joi');

const mealType = require("../../_helpers/meals");
const role = require("../../_helpers/role");

const serializer = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    type: Joi.string().required(),
    pdv: Joi.number().required(),
    discount: Joi.number().required(),
    refreshToken: Joi.string().required()
});

async function add(req, res) {

    delete req.body.userId;
    delete req.body.accessToken;
    const result = serializer.validate(req.body);
    if(result.error) {
        return res.status(400).send(result.error);
    }

    const authorizedUser = await User.findOne({ refreshToken: result.value.refreshToken });
    if(authorizedUser && authorizedUser.role != role.Admin) return res.sendStatus(403); 

    const savedMeal = await Meal.findOne({ name: result.value.name });
    if(savedMeal) {
        return res.status(400).json({ error: 'Meal already exists on the menu' });
    }
    const newMeal = new Meal();
    newMeal.name = result.value.name;
    newMeal.description = result.value.description;
    newMeal.price = result.value.price;
    newMeal.type = getMealTypeFromString(result.value.type.toLowerCase());
    newMeal.pdv = result.value.pdv;
    newMeal.discount = result.value.discount;

    try {
        await newMeal.save();
        return res.status(201).json({ status: 'Meal saved' });
    }
    catch(err) {
        return res.status(500).json({ error: err });
    }
}

function getMealTypeFromString(string) {

    if(string == 'predjelo') {
        return mealType.Appetizer;
    }
    else if(string == 'glavno jelo') {
        return mealType.MainCourse;
    }
    else if(string == 'desert') {
        return mealType.Desert;
    }
    else return mealType.Grill;
}

module.exports = add;