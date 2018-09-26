

const mongoose = require('mongoose');
const User = require('../models/user');

const express = require('express');
const router = express.Router();

const 
router.post('/', (req, res, next) => {
  const {username, password, firstName, lastName} = req.body;

  return User.hashPassword(password)
    .then(digest => {
      const newUser = {
        username,
        password: digest,
        fullname: firstName + ' ' + lastName
      };
      return User.create(newUser);
    })
    .then(result => {
      return res.status(201).location(`/api/users/${result.id}`).json(result);
    })
    .catch(err => {
      err = new Error('The username already exists');
      err.status = 400;
      next(err);
    });
});

module.exports = router;