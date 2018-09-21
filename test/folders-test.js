const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../server');
const { TEST_MONGODB_URI } = require('../config');

const Folder = require('../models/folder');
const Note = require('../models/note');

const { folders } = require('../db/seed/folders');
const notes = require('../db/seed/notes');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Test folders API endpoints', function() {
  before(function () {
    return mongoose.connect(TEST_MONGODB_URI)
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function () {
    return Promise.all([
      Note.insertMany(notes),
      Folder.insertMany(folders),
      Folder.createIndexes()
    ]);
  });

  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });

  after(function () {
    return mongoose.disconnect();
  });

  describe('GET /api/folders', function() {
    it.only('should return folders that match against the database', function() {
      return Promise.all([
        Folder.find(),
        chai.request(app).get('/api/folders')
      ])
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(data.length);
        });
    });
  });

  describe('GET /api/folders/:id', function() {
    it('should return correct folder', function () {
      let data;
      // 1) First, call the database
      return Folder.findOne()
        .then(_data => {
          data = _data;
          // 2) then call the API with the ID
          return chai.request(app).get(`/api/folders/${data.id}`);
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;

          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('id', 'name', 'createdAt', 'updatedAt');

          // 3) then compare database results to API response
          expect(res.body.id).to.equal(data.id);
          expect(res.body.name).to.equal(data.name);
          expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
          expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
        });
    });
  });

  describe('POST /api/folders', function() {
    
    it('should create and return a new folder when valid data is sent', function() {
      const newItem = {
        'title': 'The best article about cats ever!',
        'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...'
      };

      let res;
      // 1) First, call the API
      return chai.request(app)
        .post('/api/folders')
        .send(newItem)
        .then(function (_res) {
          res = _res;
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('id', 'name', 'createdAt', 'updatedAt');
          // 2) then call the database
          return Folder.findById(res.body.id);
        })
        // 3) then compare the API response to the database results
        .then(data => {
          expect(res.body.id).to.equal(data.id);
          expect(res.body.name).to.equal(data.name);
          expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
          expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
        });
    });

    it('should fail when the folder name is not specified', function() {
      const newItem = {
        'title': 'folders should not have this field'
      };
      return chai.request(app)
        .post('/api/folders')
        .send(newItem)
        .then(function(res) {
          expect(res).to.have.status(500);
        });
    });

    // it('should not accept many folders being added in a short timespan', function() {

    // });
  });
  
  describe('PUT /api/folders/:id', function() {

    // it('should fail when no id is specified', function() {

    // });
    
    // it('should fail when the body id does not match the param id', function () {
    
    // });
    
    // 1. grab existing entry from db
    // 2. request that the item be updated through the API
    // 3. check that the network call returned new data
    // 4. check that the database was updated correctly
    it('should update the correct folder with the specified id', function() {
      const newData = {
        'name': ' gujheurjq9ojwUHNOWIJAREIOANH'
      };

      let itemToUpdate;

      // grab item and send update request
      return Folder.findOne()
        .then(_itemToUpdate => {
          itemToUpdate = _itemToUpdate;
          return chai.request(app).put(`/api/folders/${itemToUpdate.id}`).send(newData);
        })
        .then(res => {
          // verify response
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body.name).to.equal(newData.name);

          return Folder.findById(itemToUpdate.id);
        })
        .then(dbRes => {
          // TODO
        });
    });

    // it('should throttle folder updates if too many are being changed at once', function() {

    // });
  });

  describe('DELETE /api/folders/:id', function() {

    // get an object id, delete it through the api, and
    // verify that it was deleted from the database
    it('should delete the correct folder from an id', function() {
      let id;
      return Folder.findOne()
        .then(dbRes => {
          id = dbRes.id;
          return chai.request(app).delete('/api/folders/' + id);
        })
        .then(res => {
          expect(res).to.have.status(204);
          return Folder.findById(id);
        })
        .then(dbRes => {
          expect(dbRes).to.be.null;
        });
    });
  });

});