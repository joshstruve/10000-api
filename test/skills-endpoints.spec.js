const app = require('../src/app');
const knex = require('knex');
const helpers = require('./test-helpers');
const supertest = require('supertest');
const { seedTables } = require('./test-helpers');


describe('Skills Endpoints', () => {
  let db;

  const {
    testUsers,
    testSkills,
  } = helpers.makeSkillsFixtures();

  const testUser = testUsers[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });
  
  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));  

  //GET

  describe('GET /api/skills', () => {
    context('given skills', () =>{
        const bearerToken = helpers.makeBearerToken(testUser); 
      beforeEach('insert skills', () => {
        helpers.seedTables(db,testUsers,testSkills);
      });
      it('should return an array of skills', () => {
        return supertest(app)
          .get('/api/skills')
          .set('Authorization',`Bearer ${bearerToken}`)
          .expect(200);
      });
    });
  });

  context('logged in and seeded tables', () => {
    const bearerToken = helpers.makeBearerToken(testUser);    
    beforeEach('insert test users', () => {
      return helpers.seedUsers(db,testUsers);
    });
    beforeEach('insert test skills', () => {
      return helpers.seedSkills(db,testSkills);
    });

    //POST

    describe('POST /skills', () => {
      const newTestSkill = {
        title: 'impressive skill',
        time_left: '36,000,000,000'
      };
      it('should return the posted skill', () => {
        return supertest(app)
          .post('/api/skills')
          .set('Authorization',`Bearer ${bearerToken}`)
          .send(newTestSkill)
          .expect(201);
      });    
    });

    //PATCH

    describe('PATCH /${skills_id}', () => {
      it('should return 400 with missing fields', () => {
        const skills_id = 1;
        return supertest(app)
          .patch(`/api/skills/${skills_id}`)
          .set('Authorization',`Bearer ${bearerToken}`)
          .expect(400,{error: 'Needs at least one update field'});
      });
      it('should return a 401 with an skill_id that can\'t be found', () => {
        const skills_id = 1979;
        return supertest(app)
          .patch(`/api/skills/${skills_id}`)
          .set('Authorization',`Bearer ${bearerToken}`)
          .send({title:'a different title', time_left:36000000000})
          .expect(400,{error: 'Could not find skill'});
      });
      it('should return a 401 when id doesn\'t match bearer token', () => {
        const skills_id = 1;
        const bearerToken2 = helpers.makeBearerToken(testUsers[1]);
        const bearerTokenMatchingUser1 = bearerToken2;
        return supertest(app)
          .patch(`/api/skills/${skills_id}`)
          .set('Authorization',`Bearer ${bearerTokenMatchingUser1}`)
          .send({title:'a different title', time_left:36000000000})
          .expect(401,{error: 'Unauthorized request'});
      });
      it('should return 204', () => {
        const skills_id = 1;
        return supertest(app)
          .patch(`/api/skills/${skills_id}`)
          .set('Authorization',`Bearer ${bearerToken}`)
          .send({time_left:'36000000000'})
          .expect(204);
      });
    });

    //DELETE

    describe('DELETE /skills', () => {
      it('should return 400 if no matching id', () => {
        const skills_id = 666;
        return supertest(app)
          .delete(`/api/skills/${skills_id}`)
          .set('Authorization',`Bearer ${bearerToken}`)
          .expect(400,{error: 'Could not find this skill'});
      });    
      it('should return 204', () => {
        const skills_id = 1;
        return supertest(app)
          .delete(`/api/skills/${skills_id}`)
          .set('Authorization',`Bearer ${bearerToken}`)
          .expect(204);
      });    
    });      

    describe('GET /skills', () => {
      it('returns 200 with skills matching logged in user', () => {
        return supertest(app)
          .get('/api/skills')
          .set('Authorization',`Bearer ${bearerToken}`)
          .expect(200)
      });
    });
  });
});