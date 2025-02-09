import * as chai from 'chai';
import { describe, it, before, after } from 'mocha';
import pkg from 'supertest'; 
import app from '../api.mjs';
import { db } from '../db/db.mjs';
import * as sinon from 'sinon';

// https://dawsoncollege.gitlab.io/520JS/520-Web/exercises/09_2_mongo_express.html


// stub the db function associated with my route
const stubGetgetFilteredSeries = sinon.stub(db, 'getFilteredSeries');

const request  = pkg;

const expect = chai.expect;
const assert = chai.assert;

/*
{
  'id': int,
  'name': string,
  'score': int,
  'numberOfSeasons': int,
  'genres': list,
  'companyId': int,
  'companyType': string
  'artwork': string,
  'year': int
}
*/

describe('Test getting series with and without query parameters', () => {
  before(() => {
    // these are real examples from the database i copied over
    stubGetgetFilteredSeries.resolves([
      {
        '_id': '671c67438e349e8a74cefd39',
        'id': 70327,
        'name': 'Buffy the Vampire Slayer',
        'score': 491166,
        'numberOfSeasons': 8,
        'genres': ['Horror', 'Fantasy', 'Drama', 'Comedy', 'Adventure', 'Action', 'Romance'],
        'companyId': 2178,
        'companyType': 'cable',
        'artwork': 'https://artworks.thetvdb.com/banners/posters/70327-1.jpg',
        'year': 2014
      },
      {
        '_id': '671c67438e349e8a74cefd3a',
        'id': 70328,
        'name': 'The Young and the Restless',
        'score': 34583,
        'numberOfSeasons': 36,
        'genres': ['Soap', 'Drama', 'Romance'],
        'companyId': 56,
        'companyType': 'cable',
        'artwork': 'https://artworks.thetvdb.com/banners/v4/series/70328/posters/62996ec6e5ab4.jpg',
        'year': 2024
      }
      
    ]);
  });

  it('Should return an array with a status of 200', async () => {
    const response = await request(app).get('/api/series');
    
    expect(response.status).to.be.equal(200);

    assert.isArray(response.body);
  });

  it('Should have atleast 1 series with the appropriate keys', async () => {
    const response = await request(app).get('/api/series');
    const body = response.body;
    const series = body[0];

    assert.isNotNull(series);

    expect(series).to.have.property('id');  
    expect(series).to.have.property('name');    
    expect(series).to.have.property('score');    
    expect(series).to.have.property('numberOfSeasons');    
    expect(series).to.have.property('genres');
    expect(series).to.have.property('companyId');
    expect(series).to.have.property('companyType');    
    expect(series).to.have.property('artwork');    
    expect(series).to.have.property('year');    

    assert.typeOf(series.id, 'number');
    assert.typeOf(series.name, 'string');
    assert.typeOf(series.score, 'number');
    assert.typeOf(series.numberOfSeasons, 'number');
    assert.typeOf(series.genres, 'array');
    assert.typeOf(series.companyId, 'number');
    assert.typeOf(series.companyType, 'string');
    assert.typeOf(series.artwork, 'string');
    assert.typeOf(series.year, 'number');
  });

  it('Should return an error with status 400 because name query parameter is empty ', async () => {
    const response = await request(app).get(`/api/series?name=`);
    const body = response.body;

    assert.isObject(body);

    expect(response.status).to.be.equal(400);
    expect(body).to.have.property('message');

    assert.strictEqual(body.message, 'Name cannot be empty');
  });

  it('Should return an error with status 400 because year query parameter is below 1980', 
    async () => {
      const response = await request(app).get(`/api/series?year=1979`);
      const body = response.body;

      assert.isObject(body);

      expect(body).to.have.property('message');
      expect(response.status).to.be.equal(400);

      assert.strictEqual(body.message, 'Year must be between 2010 and 2024');
    });

  it('Should return an error with status 400 because year query parameter is above 2024', 
    async () => {
      const response = await request(app).get(`/api/series?year=2025`);
      const body = response.body;

      assert.isObject(body);

      expect(body).to.have.property('message');
      expect(response.status).to.be.equal(400);

      assert.strictEqual(body.message, 'Year must be between 2010 and 2024');
    });

  it('Should return an error with status 400 because year query parameter is empty', 
    async () => {
      const response = await request(app).get(`/api/series?year=''`);
      const body = response.body;

      assert.isObject(body);

      expect(body).to.have.property('message');
      expect(response.status).to.be.equal(400);

      assert.strictEqual(body.message, 'Year must be between 2010 and 2024');
    });
  
  it('Should return an error with status 400 because type query parameter is empty', 
    async () => {
      const response = await request(app).get(`/api/series?type=''`);
      const body = response.body;

      assert.isObject(body);

      expect(body).to.have.property('message');
      expect(response.status).to.be.equal(400);

      assert.strictEqual(body.message, 'Type must be either cable or streaming');
    });

  it('Should return an error with status 400 because type query is not cable/streaming', 
    async () => {
      const response = await request(app).get(`/api/series?type='television'`);
      const body = response.body;

      assert.isObject(body);

      expect(body).to.have.property('message');
      expect(response.status).to.be.equal(400);

      assert.strictEqual(body.message, 'Type must be either cable or streaming');
    });

  after(() => {
    stubGetgetFilteredSeries.restore();
  });
});