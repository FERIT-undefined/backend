const Meal = require('../schema');
const User = require("../schema");

const mealType = require("../../_helpers/meals");
const role = require("../../_helpers/role");

async function add(req, res) {

    const data = req.body;
    const authorizedUser = await User.findOne({ refreshToken: data.refreshToken });
    
    if(!authorizedUser || authorizedUser.role != role.Admin) return res.status(403); 

    const savedMeal = await Meal.findOne({ name: data.name });
    if(savedMeal) {
        return res.status(400).json({ error: 'Meal already exists on the menu' });
    }

    const newMeal = new Meal();
    newMeal.name = data.name;
    newMeal.description = data.description;
    newMeal.price = data.price;
    newMeal.type = getMealTypeFromString(data.type.toLowerCase());
    newMeal.pdv = data.pdv;
    newMeal.discount = data.discount;

    try {
        await newMeal.save();
        return res.status(201).json({ status: 'Meal saved' });
    }
    catch(err) {
        return res.status(500).json({ error: err });
    }
}

function getMealTypeFromString(string) {

    if(string == 'appetizer') {
        return mealType.Appetizer;
    }
    else if(string == 'main course') {
        return mealType.MainCourse;
    }
    else if(string == 'desert') {
        return mealType.Desert;
    }
    else if(string == 'grill') {
        return mealType.Grill;
    }
}

module.exports = add;