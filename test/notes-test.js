const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../server');
const { TEST_MONGODB_URI } = require('../config');

const Note = require('../models/note');

const { notes } = require('../db/seed/notes');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Test notes API', function() {
  before(function () {
    return mongoose.connect(TEST_MONGODB_URI)
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function () {
    return Note.insertMany(notes);
  });

  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });

  after(function () {
    return mongoose.disconnect();
  });

  describe('GET /api/notes', function() {
    it('should return notes that match against the database', function() {
      return Promise.all([
        Note.find(),
        chai.request(app).get('/api/notes')
      ])
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(data.length);
        });
    });
  });

  describe('GET /api/notes/:id', function() {
    it('should return correct note (GET /api/notes/:id/', function () {
      let data;
      // 1) First, call the database
      return Note.findOne()
        .then(_data => {
          data = _data;
          // 2) then call the API with the ID
          return chai.request(app).get(`/api/notes/${data.id}`);
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;

          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('id', 'title', 'content', 'createdAt', 'updatedAt');

          // 3) then compare database results to API response
          expect(res.body.id).to.equal(data.id);
          expect(res.body.title).to.equal(data.title);
          expect(res.body.content).to.equal(data.content);
          expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
          expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
        });
    });
  });

  describe('POST /api/notes', function() {
    
    it('should create and return a new note when valid data is sent', function() {
      const newItem = {
        'title': 'The best article about cats ever!',
        'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...'
      };

      let res;
      // 1) First, call the API
      return chai.request(app)
        .post('/api/notes')
        .send(newItem)
        .then(function (_res) {
          res = _res;
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('id', 'title', 'content', 'createdAt', 'updatedAt');
          // 2) then call the database
          return Note.findById(res.body.id);
        })
        // 3) then compare the API response to the database results
        .then(data => {
          expect(res.body.id).to.equal(data.id);
          expect(res.body.title).to.equal(data.title);
          expect(res.body.content).to.equal(data.content);
          expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
          expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
        });
    });

    it('should fail when required fields are missing', function() {
      const newItem = {
        'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...'
      };
      return chai.request(app)
        .post('/api/notes')
        .send(newItem)
        .then(function(res) {
          expect(res).to.have.status(500);
        });
    });

    // it('should not accept many notes being added in a short timespan', function() {

    // });
  });
  
  describe('PUT /api/notes/:id', function() {

    // it('should fail when no id is specified', function() {

    // });

    // it('should fail when the body id does not match the param id', function () {

    // });

    // 1. grab existing entry from db
    // 2. request that the item be updated through the API
    // 3. check that the network call returned new data
    // 4. check that the database was updated correctly
    it('should update the correct note with the specified id', function() {
      const newData = {
        'title': 'modified title',
        'content': 'hjatuowehtiuht9awenhtiuathnoeui'
      };

      let itemToUpdate;

      // grab item and send update request
      return Note.findOne()
        .then(_itemToUpdate => {
          itemToUpdate = _itemToUpdate;
          return chai.request(app).put(`/api/notes/${itemToUpdate.id}`).send(newData);
        })
        .then(res => {
          // verify response
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body.title).to.equal(newData.title);
          expect(res.body.content).to.equal(newData.content);

          return Note.findById(itemToUpdate.id);
        })
        .then(dbRes => {
          // TODO
        });
    });

    // it('should throttle note updates if too many are being changed at once', function() {

    // });
  });

  describe('DELETE /api/notes/:id', function() {

    // get an object id, delete it through the api, and
    // verify that it was deleted from the database
    it('should delete the correct note from an id', function() {
      let id;
      return Note.findOne()
        .then(dbRes => {
          id = dbRes.id;
          return chai.request(app).delete('/api/notes/' + id);
        })
        .then(res => {
          expect(res).to.have.status(204);
          return Note.findById(id);
        })
        .then(dbRes => {
          expect(dbRes).to.be.null;
        });
    });
  });
});