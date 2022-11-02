const express = require("express");
const router = express.Router();

const {
    signUpValidators,
    loginValidators,
    deleteValidators,
    validationHandler,
    updateValidator,
} = require("../middlewares/members/memberValidator");

const {
    signUpController,
    deleteAccountController,
    loginController,
    verifyEmailController,
    confirmationController,
    updateController,
} = require("../controllers/members/members");
const {
    getQueryController,
    makeAdminController,
    makeModeratorController,
    makeUserController,
    makeLocalController,
    makeGlobalController,
} = require("../controllers/members/adminActivity");

// const sendMail = require("../utilities/sendMail");

const authGuard = require("../middlewares/AuthGuards/authGuard");
const adminAuthGuard = require("../middlewares/AuthGuards/adminAuthGuard");

router.get("/", authGuard, getQueryController);
/*
    --- above route take query parameters and return array of selected members
    --- parameters can be sort, page, limit, fields(selected fields will be on the output), and other filters like name=bilas
    --- Ex : /members?page=2&limit=4&fields=email,name,passingYear,-id&sort=passingYear
*/

router.get("/verifyEmail/:email", verifyEmailController);
router.get("/confirmation/:email/:token", confirmationController);

// Post
router.post("/signup", signUpValidators, validationHandler, signUpController);

router.post("/login", loginValidators, validationHandler, loginController);

// router.post("/sendMail", async (req, res) => {
//     try {
//         const info = await sendMail({
//             to: "cse_1912020049@lus.ac.bd",
//             subject: "I am here now ✔",
//             textMsg: "abrakadabra",
//             htmlMsg: "<b>Hello0o0o0o0o world?</b>",
//         });

//         res.status(201).send({
//             msg: "Successful",
//             info,
//         });
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

// Update

router.put(
    "/",
    authGuard,
    updateValidator,
    validationHandler,
    updateController
);

// Delete
router.delete(
    "/",
    authGuard,
    deleteValidators,

    validationHandler,
    deleteAccountController
);

// Admin Activity
router.get("/admin/makeAdmin/:id", adminAuthGuard, makeAdminController);
router.get("/admin/makeModerator/:id", adminAuthGuard, makeModeratorController);
router.get("/admin/makeUser/:id", adminAuthGuard, makeUserController);
router.get("/admin/makeLocalMember/:id", adminAuthGuard, makeLocalController);
router.get("/admin/makeGlobalMember/:id", adminAuthGuard, makeGlobalController);

module.exports = router;
