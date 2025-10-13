import OTP from '../models/otp.js'
import otpGenerator from 'otp-generator'
import mailSender from '../utility/mailSender.js'

async function sendOTP(req, res, next) {
  try {
    const email = req.body.email

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    })

    console.log(otp)

    let result = await OTP.findOne({ otp: otp })

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      })
      result = await OTP.findOne({ otp: otp })
    }

    const otpPayload = { email, otp }
    const otpBody = await OTP.create(otpPayload)

    const mailResponse = await mailSender(
      email,
      'Verification Email',
      `<h1>Please confirm your OTP</h1>
       <p>Here is your OTP code: ${otp}</p>`
    )
    console.log('Email sent successfully: ', mailResponse)

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      otpBody,
    })

    next()
  } catch (err) {
    next(err)
  }
}
export { sendOTP }
