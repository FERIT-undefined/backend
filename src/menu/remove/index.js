const Meal = require('../schema');

async function remove(req, res) {

    const id = req.params.id;
    if (id == null || id.length != 24) return res.status(400);

    try {
        await Meal.findByIdAndRemove(id);
        return res.status(410).json({ status: 'Meal removed' });
    }
    catch(err) {
        return res.status(500).json({ error: err });
    }
}

module.exports = remove;