const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config');

const Note = require('../models/note');

// create functions and call them in here to test them
function testQueries() {
  const queries = [
    // findAndSearch(),
    // createNote()
    // findById('000000000000000000000002')
    // findAndUpdate('5ba1566686d6ed45d030e4d9')
    findAndUpdate('5ba155cffeb22e8c6cf7965a'),
    findById('5ba155cffeb22e8c6cf7965a')
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

  return Note.find(filter).sort({ updatedAt: 'desc' })
    .then(results => {
      console.log(results);
    });
}

function findById(id) {
  return Note.findById(id)
    .then(result => console.log(result));
}

function createNote() {
  return Note.create({title: 'foo', content: 'bar'})
    .then(result => console.log(result));
}

function findAndUpdate(id) {
  return Note.findByIdAndUpdate(id, {title: 'updated title'}, {new: true})
    .then(result => console.log(result));
}

function findAndRemove(id) {
  return Note.findByIdAndRemove(id)
    .then(() => console.log('deleted ' + id));
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