const jwt = require('jsonwebtoken');
const config = require('../config');


const AuthService = {
  getByUserName(db,email){
    
    return db('users')
      .select('*')
      .where({email})
      .first();
  },

  verifyJwt(token) {
    return jwt.verify(token, 'miki', {
      algorithms: ['HS256'],
    });
  },
};

module.exports = AuthService;