import nodemailer from 'nodemailer'
import { MAIL_HOST, MAIL_PASS, MAIL_USER } from '../../constants.js'
console.log(MAIL_HOST, MAIL_PASS, MAIL_USER)

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    })

    transporter.verify((error, success) => {
      if (error) console.log('Transporter verification failed:', error)
      else console.log('Transporter is ready')
    })

    let info = await transporter.sendMail({
      from: `"Shreya Jha" <${MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    })

    console.log('Email sent:', info.response)
    return info
  } catch (error) {
    console.log('Error sending email:', error.message)
  }
}

export { mailSender }
