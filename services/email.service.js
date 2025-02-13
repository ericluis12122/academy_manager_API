import nodemailer from 'nodemailer';

import { EMAIL_SERVICE, EMAIL_ADDRESS, EMAIL_PASSWORD, BASE_URL } from '../config/env.js';

const transporter = nodemailer.createTransport({
  service: EMAIL_SERVICE,
  auth: {
    user: EMAIL_ADDRESS,
    pass: EMAIL_PASSWORD,
  },
});

const sendVerificationEmail = (email, verificationToken) => {
  const verificationLink = `https://${BASE_URL}/auths/verify_email/${verificationToken}`;
  const mailOptions = {
    from: EMAIL_ADDRESS,
    to: email,
    subject: 'Verifica tu correo electrónico',
    text: `Por favor, haz clic en el siguiente enlace para verificar tu correo electrónico: ${verificationLink}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error al enviar el correo:', error);
    } else {
      console.log('Correo enviado: ' + info.response);
    }
  });
};
const sendGuideEmail = (email) => {
  const time24HoursLater = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

  setTimeout(() => {
    const mailOptions = {
      from: EMAIL_ADDRESS,
      to: email,
      subject: 'Guía de la aplicación',
      text: `Hola, gracias por registrarte en nuestra aplicación. Aquí tienes una guía para comenzar a usarla.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error al enviar el correo:', error);
      } else {
        console.log('Correo enviado: ' + info.response);
      }
    });
  }, time24HoursLater); // Ejecutar después de 24 horas
};

export { sendVerificationEmail, sendGuideEmail };
