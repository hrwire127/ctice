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

module.exports.sendRegisterEmail = function (name, email, confirmationCode)
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
            <a href=${process.env.NEXT_PUBLIC_DR_HOST}/user/pending/${confirmationCode}> Click here</a>
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

module.exports.sendResetEmail = function (name, email, confirmationCode)
{
	return new Promise((resolve, reject) =>
	{
		transport.sendMail({
			from: user,
			to: email,
			subject: "Please confirm your account",
			html: `<h1>Email Confirmation</h1>
            <h2>Hello ${name}</h2>
            <p>There was a password reset requst for your account. Please reset your password by clicking on the following link</p>
            <a href=${process.env.NEXT_PUBLIC_DR_HOST}/user/reset/${confirmationCode}> Click here</a>
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