const nodemailer = require('nodemailer');

let transporter = null;

module.exports.createTransporter = async function () {
    let testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });
    transporter.verify(function (error, success) {
        if (error) {
            console.log(error);
        } else {
            console.log('Mail Server is ready to take our messages');
        }
    });
}

function sendmail(to, subject, html) {
    const mailOptions = {
        to: to,
        subject: subject,
        html: html,
    };
    console.log('Sending email')
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }
    });
}

module.exports.sendOTP = function (to, otp) {
    const subject = "Sign-up verification for RFC";
    const html =`<div
    class="container"
    style="max-width: 90%; margin: auto; padding-top: 20px">
    <h2>Welcome to the Rishabh Food Court.</h2>
    <h4>You are officially In ✔</h4>
    <p style="margin-bottom: 30px;">Pleas enter the sign up OTP to get started</p>
    <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${otp}</h1>
    </div>`
    sendmail(to, subject, html);
}