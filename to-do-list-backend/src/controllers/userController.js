import bcrypt from 'bcrypt'
import user from '../models/userDB.js'
export default class UserOperations {
  saveUser = async (req, res, next) => {
    try {
      const username = req.body.username
      const useremail = req.body.email
      const userpassword = req.body.password
      const userrole = req.body.role

      const hashedPassword = await bcrypt.hash(userpassword, 10)

      const newUser = {
        username: username,
        email: useremail,
        password: hashedPassword,
        role: userrole,
      }
      const newuser = await user.create(newUser)
      console.log(newuser)
      res.status(201).json({ message: 'user registered', success: true })
    } catch (err) {
      next(err)
    }
  }
}
