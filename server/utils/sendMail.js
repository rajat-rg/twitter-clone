const nodemailer = require('nodemailer')

const sendMail = async(email, subject, html)=>{
    try {
        const transporter = nodemailer.createTransport({
            host:process.env.HOST,
            service:process.env.SERVICE,
            port:Number(process.env.PORT),
            secure:Boolean(process.env.SECURE),
            auth:{
                user:process.env.USER,
                pass:process.env.PASSWORD
            }
    
        })
    
        await transporter.sendMail({
            from:process.env.USER,
            to:email,
            subject,
            html
        })
    } catch (error) {
        console.log("Email not sent") 
        console.log(error)       
    }
}

module.exports = {sendMail}