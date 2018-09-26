
const express = require('express');

const Folder = require('../models/folder');

const router = express.Router();

const mongoose = require('mongoose');

const passport = require('passport');

const {requireFields, validateParamAndBodyId, validateParamId}
  = require('../utils/server-validation');

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

router.get('/', (req, res, next) => {
  return Folder.find().sort({name: 'desc'})
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

router.get('/:id', validateParamId, (req, res, next) => {
  const {id} = req.params;

  return Folder.findOne({_id: id})
    .then(result => {
      return res.json(result);
    })
    .catch(err => next(err));
});

router.put('/:id', requireFields(['name']), validateParamAndBodyId, (req, res, next) => {
  return Folder.findByIdAndUpdate(req.params.id, {name}, {new: true})
    .then(result => {
      return res.json(result);
    })
    .catch(err => next(err));
});

router.post('/', requireFields(['name']), (req, res, next) => {
  return Folder.create({name})
    .then(result => {
      return res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err));
});

router.delete('/:id', validateParamId, (req, res) => {
  return Folder.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end());
});

module.exports = router;