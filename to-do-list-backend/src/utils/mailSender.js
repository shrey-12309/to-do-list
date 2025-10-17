// src/utility/mailSender.js
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const mailSender = async (email, title, body) => {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    throw new Error('Missing MAIL_USER or MAIL_PASS in environment variables')
  }

  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.MAIL_PORT) || 465,
    secure: process.env.MAIL_PORT ? process.env.MAIL_PORT === '465' : true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  })

  // verify transporter config
  await transporter.verify()

  const mailOptions = {
    from: process.env.MAIL_FROM || process.env.MAIL_USER,
    to: email,
    subject: title,
    html: body,
  }

  const info = await transporter.sendMail(mailOptions)
  console.log('Email sent:', info.response)
  return info
}

export default mailSender
