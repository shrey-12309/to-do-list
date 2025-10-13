import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const mailSender = async (email, title, body) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  })

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: title,
    html: body,
  }

  // Send the email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}

export default mailSender
