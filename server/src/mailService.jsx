// servidor/mailService.jsx

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Ajusta esto según el servicio que utilices
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendMail = async (to, subject, text) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        });
        console.log('Email enviado:', info.response);
    } catch (error) {
        console.error('Error al enviar email:', error);
    }
};

module.exports = { sendMail };