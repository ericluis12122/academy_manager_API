import nodemailer from 'nodemailer';
import cron from 'node-cron';

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
  const date24HoursLater = new Date();
  date24HoursLater.setHours(date24HoursLater.getHours() + 24);
  cron.schedule(date24HoursLater, () => {
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
  });
};

export { sendVerificationEmail, sendGuideEmail };
