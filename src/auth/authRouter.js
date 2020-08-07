  
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AuthService = require('./authService');

const AuthRouter = express.Router();

AuthRouter
  .route('/login')
  .post(express.json(), (req,res,next) => {
    const {email,password} = req.body;
    const loginUser = {
      email,
      password
    };

    for(const [key,value] of Object.entries(loginUser))
      if(value == null)
        return res.status(400).json(`Missing ${key}`);

    AuthService.getByUserName(req.app.get('db'), loginUser.email)
      .then(user => {
        if(!user)
          return res.status(401).json('Invalid email or password');

        return bcrypt.compare(password, user.password)
          .then(passwordMatch => {
            if(!passwordMatch)
              return res.status(401).json('Invalid email or password');
            const token = jwt.sign({user_id: user.id},"miki",{subject: user.email});
            return res.json({authToken:token});
          });
      })
      .catch(next);
  });

module.exports = AuthRouter;