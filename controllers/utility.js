const express = require("express");
const jwt = require("jsonwebtoken");

const sendMail = require("../utilities/sendMail");

const sendMailController = async (req, res) => {
  try {
    const { to, fromName, subject, textMsg, htmlMsg } = req.body;
    const info = await sendMail(to, fromName, subject, textMsg, htmlMsg);
    res.status(401).send({ msg: "Authentication !Failed!", info: info });
    // res.status(401).send({ msg: "Authentication Failed!" });
  } catch (err) {
    res.status(401).send({ msg: "Authentication Failed!", err });
  }
};

module.exports = {
  sendMailController,
};
