const nodemailer = require("nodemailer");

const sendMail = async ({
  to,
  fromName = "IEEE CS LU SBC",
  subject,
  textMsg,
  htmlMsg,
}) => {
  const err = {};
  if (!to || typeof to !== "string") {
    err["to"] = {
      msg: "Please provide a valid email address!",
    };
  }
  if (!subject || typeof subject !== "string") {
    err["subject"] = {
      msg: "Please provide a proper subject!",
    };
  }
  if (htmlMsg && typeof htmlMsg !== "string") {
    err["htmlMsg"] = {
      msg: "Please provide a proper HTML String!",
    };
  }
  if (textMsg && typeof textMsg !== "string") {
    err["textMsg"] = {
      msg: "Please provide a proper Text Message String!",
    };
  }
  if ((!htmlMsg && !textMsg) || (err["htmlMsg"] && err["textMsg"])) {
    err["body"] = {
      msg: "Body Should Not Be Empty! Provide textMsg / htmlMsg.",
    };
  }

  if (Object.keys(err).length > 0) {
    return err;
  }

  const emailAddress = process.env.REGULAR_EMAIL_ADDRESS;
  const emailPassword = process.env.REGULAR_EMAIL_PASSWORD;
  console.log(emailAddress);
  console.log(emailPassword);

  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: emailAddress,
      pass: emailPassword,
    },
  });

  try {
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: `"${fromName}" <${emailAddress}>`,
      to,
      // to: "bar@example.com, baz@example.com", // list of receivers
      subject, // Subject line
      text: textMsg, // plain text body
      html: htmlMsg, // html body
    });

    return info;
  } catch (err) {
    console.log("calling");
    return err;
  }
};

module.exports = sendMail;
