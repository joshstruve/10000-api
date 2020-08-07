const { DATABASE_URL } = require('../config');
const xss = require('xss');
const bcrypt = require('bcryptjs');

const UsersService = {
  hasUserWithEmail(db,email){
    return db('users')
      .select('*')
      .where({email})
      .first();

  },
  insertUser(db,newUser){
    return db
      .insert(newUser)
      .into('users')
      .returning('*')
      .then(rows => rows[0]);
  },
  hashPassword(password){
    return bcrypt.hash(password, 12);
  },
  serializeUser(user){
    return {
      id: user.id,
      email: xss(user.email),
      date_created: new Date(user.date_created),
    };
  },
};

module.exports = UsersService;