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

async function editMeal(req, res) {

    delete req.body.userId;
    delete req.body.accessToken;
    const id = req.params.id;
    if (id == null || id.length != 24) return res.status(400).send('Invalid meal ID');

    const result = serializer.validate(req.body);
    if(result.error) {
        return res.status(400).send(result.error);
    }

    const authorizedUser = await User.findOne({ refreshToken: result.value.refreshToken });    
    if(!authorizedUser || authorizedUser.role != role.Admin) return res.sendStatus(403); 

    await Meal.findByIdAndUpdate(id, { 
        name: result.value.name, 
        description: result.value.description, 
        price: result.value.price,
        type: getMealTypeFromString(result.value.type.toLowerCase()), 
        pdv: result.value.pdv, 
        discount: result.value.discount 
    });
    try {
        return res.status(200).json({ status: 'Meal successfully edited' });
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

module.exports = editMeal;