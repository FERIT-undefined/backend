const Meal = require('../schema');
const User = require('../../users/schema');

const role = require("../../_helpers/role");

async function remove(req, res) {

    const id = req.params.id;
    if (id == null || id.length != 24) return res.sendStatus(400);

    const authorizedUser = await User.findOne({ refreshToken: req.body.refreshToken });
    if(authorizedUser.role != role.Admin) return res.sendStatus(403);

    try {
        await Meal.findByIdAndRemove(id);
        return res.status(201).send('Meal removed');
    }
    catch(err) {
        return res.status(500).json({ error: err });
    }
}

module.exports = remove;