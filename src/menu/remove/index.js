const Meal = require('../schema');
const User = require('../../users/schema');

const role = require("../../_helpers/role");

async function remove(req, res) {

    const id = req.params.id;
    if (id == null || id.length != 24) return res.status(400);

    const authorizedUser = await User.findOne({ refreshToken: req.body.refreshToken });
    if(!authorizedUser || authorizedUser.role != role.Admin) return res.status(403);

    try {
        await Meal.findByIdAndRemove(id);
        return res.status(410).json({ status: 'Meal removed' });
    }
    catch(err) {
        return res.status(500).json({ error: err });
    }
}

module.exports = remove;