const nodemailer = require("nodemailer");

const user = process.env.USER;
const pass = process.env.PASS;

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: user,
    pass: pass,
  },
});

module.exports.sendConfirmationEmail = function (name, email, confirmationCode)
{
  return new Promise((resolve, reject) =>
  {
    transport.sendMail({
      from: user,
      to: email,
      subject: "Please confirm your account",
      html: `<h1>Email Confirmation</h1>
            <h2>Hello ${name}</h2>
            <p>Thank you for registrating. Please confirm your email by clicking on the following link</p>
            <a href=http://localhost:3000/user/confirm/${confirmationCode}> Click here</a>
            </div>`,
    }).then(res =>
    {
      resolve(res)
    }).catch(err => 
    {
      reject(err)
    });
  })
}
