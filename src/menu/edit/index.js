const Meal = require('../schema');
const User = require("../schema");

const mealType = require("../../_helpers/meals");
const role = require("../../_helpers/role");

async function editMeal(req, res) {

    const id = req.params.id;
    if (id == null || id.length != 24) return res.status(400).send('Invalid meal ID');

    const data = req.body;
    const authorizedUser = await User.findOne({ refreshToken: data.refreshToken });
    
    if(!authorizedUser || authorizedUser.role != role.Admin) return res.status(403); 

    await Meal.findByIdAndUpdate(id, { name: data.name, description: data.description, price: data.price, type: getMealTypeFromString(data.type), pdv: data.pdv, discount: data.discount });
    try {
        return res.status(200).json({ status: 'Meal successfully edited' });
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

module.exports = editMeal;