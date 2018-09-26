const mongoose = require('mongoose');

const { MONGODB_URI } = require('../config');
const Note = require('../models/note');
const Folder = require('../models/folder');
const Tag = require('../models/tag');
const User = require('../models/user');

const {notes, folders, tags, users} = require('../db/seed-data');

mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
  .then(() => mongoose.connection.db.dropDatabase())
  .then(() => {
    return Promise.all([
      Note.insertMany(notes),
      Folder.insertMany(folders),
      Tag.insertMany(tags),
      User.insertMany(users),
      User.createIndexes(),
      Folder.createIndexes(),
      Tag.createIndexes(),
    ]);
  })
  .then(results => {
    console.log('Inserted:');
    console.log(results[0].length.toString(), 'notes');
    console.log(results[1].length.toString(), 'folders');
    console.log(results[2].length.toString(), 'tags');
    console.log(results[3].length.toString(), 'users');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
  });