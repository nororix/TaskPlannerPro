const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

const sendEmail = (to, subject, text) =>{
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to,
        subject,
        text
    };

transporter.sendMail(mailOptions, (error, info)=>{
    if(error){
        console.log('Error al enviar el correo:', error);
    }else{
        console.log('Correo enviado:', info.response);
    }
});
};

module.exports = sendEmail;
