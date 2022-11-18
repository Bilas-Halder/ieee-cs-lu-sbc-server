const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Member = require("../../models/memberSchema");
const VerificationToken = require("../../models/verificationTokenSchema");
const jwt = require("jsonwebtoken");
const sendMail = require("../../utilities/sendMail");

const signUpController = async (req, res) => {
    console.log({...req.body});
    const {name, email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 11);
    const member = new Member({
        name,
        email,
        password: hashedPassword,
        imgUrl: "common/MaleAvatar.png",
    });
    member.save((err, member) => {
        if (err) {
            res.status(500).send(err);
        } else {
            const {password, ...rest} = member._doc;
            const randomStr = crypto.randomBytes(128).toString("hex");
            const token = new VerificationToken({
                _memId: member._id,
                email: member.email,
                token: randomStr,
            });
            token.save(async (err, token) => {
                if (err) {
                    res.status(500).send({
                        msg: "Email not sent Please try resend verification email",
                        data: rest,
                    });
                } else {
                    try {
                        const info = await sendMail({
                            to: email,
                            subject: "Account Verification Link",
                            textMsg:
                                "Hello " +
                                member.name +
                                ",\n\n" +
                                "Please verify your account by clicking the link: \nhttp://" +
                                req.headers.host +
                                "/api/v1/members/confirmation/" +
                                email +
                                "/" +
                                token.token +
                                "\n\nThank You!\n",
                        });

                        res.status(200).send({
                            msg:
                                "A verification email has been sent to " +
                                email +
                                ". It will be expire after 5 Minute. If you not get verification Email click on resend token.",
                            data: rest,
                        });
                    } catch (err) {
                        res.status(500).send({
                            msg: "Email not sent Please try resend verification email",
                        });
                    }
                }
            });
        }
    });
};

const loginController = async (req, res) => {
    const {email, password} = req.body;
    try {
        const member = await Member.findOne({email: email});
        if (!member) {
            res.status(401).send({msg: "Authentication Failed!"});
        } else {
            const match = await bcrypt.compare(password, member.password);

            if (match) {
                if (member?.verified) {
                    //write other jwt code

                    const payload = {
                        name: member.name,
                        email: member.email,
                        _id: member._id,
                    };
                    const accessToken = jwt.sign(
                        {...payload},
                        process.env.TOKEN_SECRET,
                        {
                            expiresIn: "1d",
                        }
                    );

                    const {password, ...rest} = member._doc;

                    res.status(200).json({
                        ...rest,
                        accessToken: accessToken,
                        msg: "Login Successful!",
                    });
                } else {
                    const link = process.env.PORT
                        ? process.env.LIVE_SERVER_LINK +
                          `/api/v1/verifyEmail/${email}`
                        : `http://localhost:5000/api/v1/verifyEmail/${email}`;
                    res.status(401).send({
                        msg: "Verify your email to continue!",
                        verificationLink: link,
                        email: email,
                    });
                }
            } else {
                res.status(401).send({msg: "Authentication Failed!"});
            }
        }
    } catch (err) {
        res.status(401).send({msg: "Authentication Failed!"});
    }
};

const deleteAccountController = (req, res) => {
    const query = {email: req.body?.email};
    Member.findOne(query, async (err, data) => {
        console.log(data);
        if (err) {
            res.status(400).json(err);
        } else if (!data) {
            res.status(404).json({
                status: 404,
                message: "Member Not Exist!.",
            });
        } else {
            try {
                const match = await bcrypt.compare(
                    req.body?.password,
                    data?.password
                );

                if (match) {
                    Member.deleteOne(query, (err, data) => {
                        if (err) {
                            res.status(400).json(err);
                        } else {
                            if (data?.deletedCount) {
                                res.status(200).json({
                                    status: 200,
                                    msg: "Delete Successful.",
                                    deletedCount: 1,
                                });
                            } else {
                                res.status(424).json({
                                    status: 424,
                                    msg: "Unsuccessful! Member not found.",
                                    deletedCount: 0,
                                });
                            }
                        }
                    });
                } else {
                    res.status(401).json({
                        status: 401,
                        msg: "Wrong Password.",
                        deletedCount: 0,
                    });
                }
            } catch (err) {
                res.status(400).json(err);
            }
        }
    });
};

const updateController = async (req, res) => {
    const id = req.id;
    console.log(req.id);

    const {password, email, type, verified, role, ...updates} = req.body;

    try {
        const member = await Member.findByIdAndUpdate(
            {_id: id},
            {$set: updates},
            {
                useFindAndModify: false,
                new: true, // to return the updated document
            }
        );

        const {password, ...rest} = member._doc;

        res.status(200).send({
            status: 200,
            msg: "Successfully Updated!",
            data: {accessToken: req.authorization, ...rest},
        });
    } catch {
        res.status(500).send({
            status: 500,
            msg: "Failed to update please try again!",
        });
    }
};

const verifyEmailController = async (req, res) => {
    const email = req.params.email;
    try {
        const member = await Member.findOne({email: email});
        if (!member) {
            res.status(404).send({
                msg: "You don't have an account. Please signup to continue!",
            });
        } else if (member.verified) {
            res.status(403).send({msg: "Your account is already verified"});
        } else {
            const randomStr = crypto.randomBytes(128).toString("hex");
            const token = new VerificationToken({
                _memId: member._id,
                email: email,
                token: randomStr,
            });
            token.save(async (err, token) => {
                if (err) {
                    res.status(500).send({
                        msg: "Email not sent Please try again",
                    });
                } else {
                    try {
                        const info = await sendMail({
                            to: email,
                            subject: "Account Verification Link",
                            textMsg:
                                "Hello " +
                                member.name +
                                ",\n\n" +
                                "Please verify your account by clicking the link: \nhttp://" +
                                req.headers.host +
                                "/api/v1/members/confirmation/" +
                                email +
                                "/" +
                                token.token +
                                "\n\nThank You!\n",
                        });

                        res.status(200).send({
                            msg:
                                "A verification email has been sent to " +
                                email +
                                ". It will be expire after 5 Minute. If you not get verification Email click on resend token.",
                        });
                    } catch (err) {
                        res.status(500).send({msg: "Failed! Try again"});
                    }
                }
            });
        }
    } catch (err) {
        res.status(500).send({msg: "Failed! Try again"});
    }
};

const confirmationController = async (req, res) => {
    const token = req.params.token;
    const email = req.params.email;
    try {
        const verificationToken = await VerificationToken.findOne({
            token: token,
        });

        if (verificationToken?.email === email) {
            const member = await Member.findById(verificationToken._memId);

            if (!member) {
                res.status(500).send({
                    msg: "You don't have an account. Please Signup.",
                });
            } else if (member?.verified) {
                res.render("alreadyVerified", {
                    page: "Already Verified | IEEE CS LU SBC",
                    link: process.env.CLIENT_LIVE_LINK + "/signin",
                });
            } else {
                member.verified = true;

                member.save((err) => {
                    if (err) {
                        res.status(500).send({
                            msg: "Error ocurred! Please try again.",
                        });
                    } else {
                        return res.render("verifiedSuccess", {
                            page: "Successfully Verified | IEEE CS LU SBC",
                            link: process.env.CLIENT_LIVE_LINK + "/signin",
                        });
                    }
                });
            }
        } else {
            res.render("linkExpired", {
                page: "Link Expired | IEEE CS LU SBC",
                link:
                    process.env.LIVE_SERVER_LINK +
                    "/api/v1/members/verifyemail/" +
                    email,
            });
            // res.status(498).send({
            //     msg: "Your verification link may have expired. Please click on resend for verify your Email.",
            // });
        }
    } catch (err) {
        res.status(400).send("<h1>Bad Request</h1>");
    }
};

module.exports = {
    signUpController,
    loginController,
    updateController,
    deleteAccountController,
    verifyEmailController,
    confirmationController,
};
