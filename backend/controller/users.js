// controllers/userController.js
const User = require('../models/users');
const jwt = require('jsonwebtoken');
const { isEmailValid, isValidPass } = require('../validator/velidator')


const register = async (req, res) => {
  const { username, password } = req.body;
  try {

    if(!username || !password){
      return res.status(400).json({ message: 'Mandatory parameters missing' });
    }

    const alradyPresent = await User.findOne({ username: username })
    if (alradyPresent) {
      return res.status(400).json({success:false, message: 'You are alrady ragister' });
    }

    /*
    // IF WE USE EMAIL AS USERNAME - 
      
    if (!email) {
      return res.status(400).send({ status: false, message: "Email can not be empty" })
    }
    if (!isEmailValid(email)) {
      return res.status(400).send({ status: false, message: "Email IS NOT VALID" })
    }

    */

    if (!isValidPass(password)) {
      return res.status(400).send({
        success:false,
          message: "Password should include atleast one special character, one uppercase, one lowercase, one number and should be mimimum 8 character long",
      });
    }

    const user = new User({ username, password });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log("login",username)
    return res.status(201).json({ success: true, message: 'User registered successfully', user:user,token:token});
  } catch (error) {
    console.log(error)
    res.status(400).json({success:false, message: 'Registration failed', error });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    console.log(username,password)

    if(!username || !password){
      return res.status(400).json({success:false, message: 'Mandatory parameters missing' });
    }

    if (!isValidPass(password)) {
      return res.status(400).send({
          success:false,
          message: "Password should include atleast one special character, one uppercase, one lowercase, one number and should be mimimum 8 character long",
      });
    }


    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({success:false, message: 'Invalid username' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({success:false, message: 'Invalid password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log("login",username)
    return res.status(201).json({ success: true, message: 'User registered successfully', user:user,token:token});
  } catch (error) {
    console.log("error", error)
    res.status(500).json({ message: 'Login failed', error });
  }
};

module.exports = {
  register,
  login
}
