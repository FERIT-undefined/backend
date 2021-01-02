const Meal = require('../schema');

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

module.exports = listAllMeals;