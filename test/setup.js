process.env.NODE_ENV = 'test';

require('dotenv').config();

process.env.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL
  || 'postgresql://localhost@10000_admin:Password1!/1000-test';

const { expect } = require('chai');
const supertest = require('supertest');

global.expect = expect;
global.supertest = supertest;