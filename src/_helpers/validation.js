const { check, validationResult } = require("express-validator");

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

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  }
];
