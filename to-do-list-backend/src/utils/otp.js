import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config()

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = new nodemailer(accountSid, authToken)

dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'gmail', // or 'outlook', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

/**
 * Sends OTP to an email address.
 * @param {string} email - The recipient's email address.
 * @param {string} otp - The one-time password to send.
 */
async function sendOTP(email, otp) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your One-Time Password (OTP)',
      text: `Your OTP is: ${otp}`,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log(`OTP sent to ${email}: ${info.messageId}`)
  } catch (error) {
    console.error('Error sending OTP:', error)
  }
}

module.exports = { sendOTP }

async function sendOTP(phone, otp) {
  try {
    const message = await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    })
    console.log(`OTP sent to ${phone}: ${message.sid}`)
  } catch (error) {
    console.error('Error sending OTP:', error)
  }
}

const User = mongoose.model('user2', sendOTP)
export default User
