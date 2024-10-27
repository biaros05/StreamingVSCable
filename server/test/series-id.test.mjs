import * as chai from 'chai';
import {it, describe} from 'mocha';
import pkg from 'supertest';
import app from '../api.mjs';

const request = pkg;
const assert = chai.assert;
const expect = chai.expect;

/*
Expect data from db to look like this
{
  name : string,
  genre: string,
  artwork : string,
  companyID: int,
  score: int,
  numberOfSeasons: int,
}
*/

describe('Testing the /api/series{id} endpoint', ()=>{
  it('should return an object with status code of 200', async ()=>{
    
    const response = await request(app).get('/api/series/73593');
    
    expect(response.status).to.be.equal(200);

    assert.isObject(response.body);
  });

  it('check body of response has valid data types', async ()=>{
    const response = await request(app).get('/api/series/70328');
    const body = response.body;
    const series = body;

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

  it('should return a 400 error if a series with the id isn\'t found', async()=>{
    const response = await request(app).get('/api/series/0');
    const body = response.body;

    expect(response.status).to.be.equal(400);

    assert.isObject(body);

    expect(body).to.have.property('message');

    assert.strictEqual(body.message, 'No series found with this id');
  });

  it('should return a 400 error if the passed id isn\'t a number', async()=>{
    const response = await request(app).get('/api/series/abc');
    const body = response.body;

    expect(response.status).to.be.equal(400);

    assert.isObject(body);

    expect(body).to.have.property('message');

    assert.strictEqual(body.message, 'id must be a number');
  });
});
