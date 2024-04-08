const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //Define The Email Option
  const mailOptions = {
    from: 'Rohan Gupta <rohg505@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // Actully send Email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
