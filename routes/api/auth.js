const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const auth = require('../../middleware/auth')
//User Model
const User = require('../../models/User')

/**
 * @route   POST api/auth
 * @desc    Auth User
 * @access  Public
 */
 router.post('/', async (req, res) => {
  const { email, password } = req.body;
  //Siple validation methods
  if(!email || !password) {
      return res.status(400).json({msg: "Please enter all fields"});
  }
  //Check existing users
  User.findOne({ email }).then(user => {
      if(!user) return res.status(400).json({msg: "User not exists"});
      // validate password
      bcrypt.compare(password, user.password).then(isMatch => {
          if(!isMatch) return res.status(400).json({msg: "Invalid password"});
          jwt.sign(
            { id: user.id },
            config.get('jwtSecret'),
            { expiresIn: 3600 },
            ( err, token ) => {
                if(err) throw err;
                res.status(201).json({
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    }
                });
            }
          )
      })
  });
  });
/**
 * @route   GET api/auth/user
 * @desc    Get User Profile
 * @access  Private
 */
 router.get('/user', auth, (req, res ) => {
    User.findById(req.user.id).select('-password').then(user => res.json(user));
})
module.exports = router;