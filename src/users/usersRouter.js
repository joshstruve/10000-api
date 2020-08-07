const express = require('express');
const UsersService = require('./usersService');

const UsersRouter = express.Router();

UsersRouter
  .route('/')
  .post(express.json(), (req,res,next) => {
    const {email,password} = req.body;
    let newUser = {
      email,
      password,
    };

    for(const [key,value] of Object.entries(newUser))
      if(!value)
        return res.status(400).json({error: `Missing ${key} in request body`});
      
    if(password.length <= 8)
      return res.status(401).json({error: 'Password must be longer than 8 characters'});

    UsersService.hasUserWithEmail(req.app.get('db'),newUser.email)
      .then(hasUserWithEmail => {
        if(hasUserWithEmail)
          return res.status(400).json({error: 'Email address already in use'});
        

        UsersService.hashPassword(password)
          .then(hashedPassword => {
            newUser.password = hashedPassword;
            return UsersService.insertUser(req.app.get('db'),newUser)
              .then(user => {
                res.status(201).json(UsersService.serializeUser(user));
              });
          });
      })
      .catch(next);    
  });

module.exports = UsersRouter;