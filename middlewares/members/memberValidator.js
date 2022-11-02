const {check, validationResult} = require("express-validator");
const createError = require("http-errors");
const bcrypt = require("bcrypt");

const Member = require("../../models/memberSchema");

// signUp validation
const signUpValidators = [
    check("name")
        .isLength({min: 1})
        .withMessage("Name is required")
        .isAlpha("en-US", {ignore: " -"})
        .withMessage("Name should only contain alphabet and space")
        .trim(),
    check("email")
        .isEmail()
        .withMessage("Invalid email address")
        .trim()
        .custom(async (value) => {
            try {
                const member = await Member.findOne({email: value});
                if (member) {
                    throw createError("Email already is in use!");
                }
            } catch (err) {
                throw createError(err.message);
            }
        }),
    // strong one -> /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
    // /^[A-Za-z @$!%*#;?&\d]{6,10}$/
    check("password")
        .matches(/^[A-Za-z @$!%*#;?&\d]{6,20}$/)
        .withMessage(
            "Password must be at least 6 characters long & should contain only alphabet, number & symbols"
        ),
    check("confirmPassword")
        .matches(/^[A-Za-z @$!%*#;?&\d]{6,20}$/)
        .withMessage(
            "Password must be at least 6 characters long & should contain only alphabet, number & symbols"
        )
        .bail()
        .custom((value, {req}) => {
            let password = req.body?.password;
            if (password !== value) {
                throw new Error("Password & Confirm Password are'nt same!");
            } else return value;
        }),
];

const loginValidators = [
    check("email").isEmail().withMessage("Authentication Failed!").trim(),
    // strong one -> /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
    // /^[A-Za-z @$!%*#;?&\d]{6,10}$/
    check("password")
        .matches(/^[A-Za-z @$!%*#;?&\d]{6,20}$/)
        .withMessage("Authentication Failed!"),
];
const updateValidator = [
    check("name")
        .optional()
        .trim()
        .isLength({min: 1})
        .withMessage("Name is required")
        .isAlpha("en-US", {ignore: " -"})
        .withMessage("Name should only contain alphabet and space"),
    check("password")
        .optional()
        .matches(/^[A-Za-z @$!%*#;?&\d]{6,20}$/)
        .withMessage("Incorrect Password!")
        .bail()
        .custom(async (value, {req}) => {
            let confirmPassword = req.body?.confirmPassword;
            if (confirmPassword !== value) {
                throw new Error("Password & Confirm Password are'nt same!");
            } else {
                return value;
            }
        }),
    check([
        "imgUrl",
        "description",
        "contact.facebook",
        "contact.linkedin",
        "contact.github",
        "contact.phone",
    ])
        .optional()
        .trim()
        .isString()
        .withMessage("Field should only contain only texts"),
    check(["imgUrl", "contact.facebook", "contact.linkedin", "contact.github"])
        .optional()
        .trim()
        .isURL()
        .withMessage("Field should only URL."),

    check(["membershipID", "passingYear", "batch"])
        .optional()
        .trim()
        .isNumeric()
        .withMessage("Field should only contain only Numeric Value."),
];

const validationHandler = function (req, res, next) {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    if (Object.keys(mappedErrors).length === 0) {
        next();
    } else {
        // response the errors
        res.status(500).json({
            errors: mappedErrors,
        });
    }
};

module.exports = {
    signUpValidators,
    loginValidators,
    deleteValidators: loginValidators,
    updateValidator,
    validationHandler,
};
