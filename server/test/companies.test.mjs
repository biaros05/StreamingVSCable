import * as chai from 'chai';
import { describe, it, after, before } from 'mocha';
import pkg from 'supertest'; 
import app from '../api.mjs';
import { db } from '../db/db.mjs';
import * as sinon from 'sinon';

const stubGetCompanyById = sinon.stub(db, 'getCompanyById');

// https://dawsoncollege.gitlab.io/520JS/520-Web/exercises/09_2_mongo_express.html

const request  = pkg;

const expect = chai.expect;

describe('GET /api/companies', () => {
  before(() => {
    stubGetCompanyById.resolves({
      id: 1,
      name: 'Test Name',
      averageScore: 89,
      type: 'cable'
    });
  });

  it('should return 400 for incorrect type', async () => {
    const response = await request(app).get('/api/companies?type=something');
    expect(response.body).to.deep.equal(
      {message: 'Not a valid type'}
    );
    expect(response.status).to.equal(400);
  });

  it('should return 400 for empty type', async () => {
    const response = await request(app).get('/api/companies?type=');
    expect(response.body).to.deep.equal(
      {message: 'Not a valid type'}
    );
    expect(response.status).to.equal(400);
  });

  it('should return 200 for no type included', async () => {
    const response = await request(app).get('/api/companies');
    expect(response.status).to.equal(200);
  });

});

describe('GET /api/companies/:id', () => {
  it('should return 400 for incorrect id type', async () => {
    const response = await request(app).get('/api/companies/notanid');
    expect(response.body).to.deep.equal(
      {message: 'Id must be an integer'}
    );
    expect(response.status).to.equal(400);
  });

  it('should return 200 for valid id type', async () => {
    const response = await request(app).get('/api/companies/1');
    expect(response.status).to.equal(200);
    chai.assert.isObject(response.body);
  });

  it('should have the proper keys for the company object', async () => {
    const response = await request(app).get('/api/companies/1');
    const body = response.body;

    expect(body).to.not.be.null;
    expect(body).to.be.an('object');

    expect(body).to.have.property('id');
    expect(body).to.have.property('name');
    expect(body).to.have.property('averageScore');
    expect(body).to.have.property('type');

    expect(body.id).to.be.a('number');
    expect(body.name).to.be.a('string');
    expect(body.averageScore).to.be.a('number');
    expect(body.type).to.be.a('string');

    expect(body.id).to.be.equal(1);    
    expect(body.name).to.be.equal('Test Name');
    expect(body.averageScore).to.be.equal(89);
    expect(body.type).to.be.equal('cable');
  });

  after(() => stubGetCompanyById.restore());
});