
const express = require('express');

const Folder = require('../models/folder');

const router = express.Router();

const passport = require('passport');

const {requireFields, validateParamAndBodyId, validateParamId}
  = require('../utils/server-validation');

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

router.get('/', (req, res, next) => {
  const {id: userId} = req.user;
  return Folder.find({userId}).sort('name')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

router.get('/:id', validateParamId, (req, res, next) => {
  const {id} = req.params;
  const {id: userId} = req.user;
  return Folder.findOne({_id: id, userId})
    .then(result => {
      return res.json(result);
    })
    .catch(err => next(err));
});

router.put('/:id', requireFields(['name']), validateParamAndBodyId, (req, res, next) => {
  const {id: userId} = req.user;
  const {name} = req.body;
  return Folder.findOneAndUpdate({_id: req.params.id, userId}, {name}, {new: true})
    .then(result => {
      if(!result) {
        const err = new Error('Could not find folder with the given id');
        err.status = 404;
        return next(err);
      }
      return res.json(result);
    })
    .catch(err => {
      if(err.code === 11000) {
        err = new Error('Folder name already exists');
        err.status = 400;
        return next(err);
      }
      next(err);
    });
});

router.post('/', requireFields(['name']), (req, res, next) => {
  const {name} = req.body;
  const {id: userId} = req.user;
  return Folder.create({name, userId})
    .then(result => {
      return res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      if(err.code === 11000) {
        err = new Error('Folder name already exists');
        err.status = 400;
        return next(err);
      }
      return next(err);
    });
});

router.delete('/:id', validateParamId, (req, res) => {
  const {id: userId} = req.user;
  return Folder.findOneAndRemove({_id: req.params.id, userId})
    .then(() => res.status(204).end());
});

module.exports = router;