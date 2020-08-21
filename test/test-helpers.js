const { JWT_SECRET } = require('../src/config');

const jwt = require('jsonwebtoken');

function makeUsersArray() {
  return [
    {email: 'email@email.com', password: '$2a$04$g5FRCYMFhz9zMamcceJfLul.uJaWNGHhoyWLoLw/XjrLWEIl2J.lW'},
    {email: 'test@test.com', password: '$3a$04$g5FRCYMFhz9zMamcceJfLul.uJaWNGHhoyWLoLw/XjrLWEIl2J.lW'},
  ];
}

function makeSkillsArray () {
  return [
    {title: 'React', time_left: 36000000000, owner_id: 1,},
    {title: 'Express', time_left: 36000000000, owner_id: 1,},
  ];
}

function makeSkillsFixtures(){
  const testUsers = makeUsersArray();
  const testSkills = makeSkillsArray();
  return {testUsers, testSkills};
}

function seedUsers(db,testUsers){
  return db.into('users').insert(testUsers);
}

function seedSkills(db,testSkills){
  return db.into('skills').insert(testSkills);
}
     
function seedTables(db,testUsers,testSkills){
    return db.transaction(async (trx) => {
      await seedUsers(trx,testUsers);
      await seedSkills(trx,testSkills);
    })
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        users,
        skills
      RESTART IDENTITY`
    )
  );
}

function makeBearerToken(testUser){
  const token = jwt.sign({user_id: testUser.id},process.env.JWT_SECRET,{subject : testUser.email});
  return token;
}

function verifyJwt(token) {
  return jwt.verify(token, process.env.JWT_SECRET, {
    algorithms: ['HS256'],
  });
}

module.exports = {
  makeUsersArray,
  makeSkillsArray,
  makeSkillsFixtures,

  seedUsers,
  seedSkills,
  seedTables,

  cleanTables,
  makeBearerToken,
  verifyJwt,
};