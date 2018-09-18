const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config');

const Note = require('../models/note');

// create functions and call them in here to test them
function testQueries() {
  const queries = [
    // findAndSearch(),
    // findById('000000000000000000000002'),
    createNote(),
    findAndUpdate(),
    findAndRemove()
  ];

  
  return Promise.all(queries);
}

function findAndSearch() {
  let searchTerm;
  searchTerm = 'lady gaga';
  let filter = {};

  if (searchTerm) {
    filter.title = { $regex: searchTerm, $options: '-i'};
  }

  Note.find(filter).sort({ updatedAt: 'desc' })
    .then(results => {
      console.log(results);
      return;
    });
}

function findById(id) {
  return Note.findById(id)
    .then(result => console.log(result));
}

function createNote() {

  Note.create({title: 'foo', content: 'bar'})
}

function findAndUpdate(id) {

}

function findAndRemove(id) {

}

mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
  .then(() => {
    return testQueries();
  })
  .then(() => {
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });