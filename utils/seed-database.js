const mongoose = require('mongoose');

const { MONGODB_URI } = require('../config');
const Note = require('../models/note');
const Folder = require('../models/folder');
const Tag = require('../models/tag');

const {notes, folders, tags} = require('../db/seed-data');

mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
  .then(() => mongoose.connection.db.dropDatabase())
  .then(() => {
    return Promise.all([
      Note.insertMany(notes),
      Folder.insertMany(folders),
      Tag.insertMany(tags)
    ]);
  })
  .then(results => {
    console.log('Inserted:');
    console.log(results[0].length.toString(), 'notes');
    console.log(results[1].length.toString(), 'folders');
    console.log(results[2].length.toString(), 'tags');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
  });