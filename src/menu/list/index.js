const Meal = require('../schema');

async function listAllMeals(req, res) {

    let allMeals = await Meal.find({});

    try {

        if(!allMeals) return res.status(404).json({ error: 'There are no meals in a database' });
        allMeals = allMeals.map((meal) => {

            return {
                name: meal.name,
                description: meal.description,
                price: meal.price + ((meal.price * (meal.pdv / 100)) - (meal.price * (meal.discount / 100))),
                type: meal.type
            };
        });
        return res.status(200).json({ allMeals });
    }
    catch(err) {
        return res.status(500).json({ error: err });
    }
}

module.exports = listAllMeals;