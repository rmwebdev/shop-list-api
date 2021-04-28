const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
//User Model
const User = require('../../models/User')

/**
 * @route   POST api/users
 * @desc    Register User
 * @access  Public
 */
 router.post('/', async (req, res) => {
  const { name, email, password } = req.body;
  //Siple validation methods
  if(!name || !email || !password) {
      return res.status(400).json({msg: "Please enter all fields"});
  }
  //Check existing users
  User.findOne({ email }).then(user => {
      if(user) return res.status(400).json({msg: "Users already exists"});
      const newUser = new User({
          name,
          email,
          password
      });

      // Create salt and hash 
      bcrypt.genSalt(10, (err, salt ) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err) throw err;
              newUser.password = hash;
              newUser.save().then(user => {
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
              });
          });
      });
  });
  });



module.exports = router;