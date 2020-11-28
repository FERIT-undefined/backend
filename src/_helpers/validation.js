const { check, validationResult } = require("express-validator");
const role = require("../_helpers/role");

var lowerCaseRoles = [];
var roles = Object.values(role);
for (var i = 0; i < roles.length; i++) {
    lowerCaseRoles.push(roles[i].toLowerCase());
}

exports.validateLoginUser = [
  check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Invalid email address!"),

  check("password").not().isEmpty().withMessage("Password cannot be empty!"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

exports.validateRegisterUser = [
  check("fname")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("First name cannot be empty!"),

  check("lname")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("Last name cannot be empty!"),

  check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Invalid email address!"),

  check("password")
  .not()
  .isEmpty()
  .escape()
  .withMessage("Password cannot be empty!"),

  check("role")
    .not()
    .isEmpty()
    .withMessage("Role cannot be empty!")
    .bail()
    .toLowerCase()
    .isIn(lowerCaseRoles)
    .withMessage("Role doesnt exist!"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  }
];
