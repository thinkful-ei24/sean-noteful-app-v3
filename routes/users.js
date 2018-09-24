

const mongoose = require('mongoose');
const User = require('../models/user');

const express = require('express');
const router = express.Router();

router.post('/', (req, res, next) => {
  const {username, password, fullname = ''} = req.body;

  const newUser = {
    username, password, fullname
  };

  User.create(newUser)
    .then(response => {
      return res.location(`${req.originalUrl}/${response.id}`);
    })
    .catch(err => next(err));
});

module.exports = router;