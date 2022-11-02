const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const Member = require("../../models/memberSchema");

const adminAuthGuard = async (req, res, next) => {
    const {authorization} = req.headers;

    try {
        const token = authorization.split(" ")[1];
        const decode = jwt.verify(token, process.env.TOKEN_SECRET);
        const {email, _id} = decode;

        const {role} = await Member.findById(_id).select("role");

        if (
            role.toLowerCase() === "admin" ||
            role.toLowerCase() === "moderator"
            // delete moderator and make another authGuard for moderators if needed
        ) {
            req.email = email;
            req.id = _id;
            next();
        } else {
            next(createError(401, "Authentication Failure!"));
        }
    } catch (err) {
        if (err.message === "jwt expired") {
            next(
                createError(419, "Session Expired! Please Login to Continue.")
            );
        } else {
            next(
                createError(
                    401,
                    "Authentication Failure! Please Login to Continue."
                )
            );
        }
    }
};
module.exports = adminAuthGuard;
