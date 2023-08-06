const nodemailer = require("nodemailer");

class SendEmail {

    static async emailVerfication(email, otp) {
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.HOST,
                service: process.env.SERVICE,
                port: Number(process.env.EMAIL_PORT),
                secure: Boolean(process.env.SECURE),
                auth: {
                    user: process.env.USER,
                    pass: process.env.PASS
                }
            })
            await transporter.SendEmail({
                from: process.env.USER,
                to: email,
                subject: "SignUp verification for RFC",
                html: `<div
                  class="container"
                  style="max-width: 90%; margin: auto; padding-top: 20px">
                  <h2>Welcome to the Rishabh Food Court.</h2>
                  <h4>You are officially In ✔</h4>
                  <p style="margin-bottom: 30px;">Pleas enter the sign up OTP to get started</p>
                  <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${otp}</h1>
             </div>`
            })
            console.log("Email sent Successfully");
        }
        catch (err){
            console.log("Can't send OTP to email");
        }
    }

}

module.exports=SendEmail;