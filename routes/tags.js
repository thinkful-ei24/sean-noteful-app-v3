
const express = require('express');

const Tag = require('../models/tag');

const router = express.Router();

const {requireFields, validateParamId, validateParamAndBodyId} = require('../utils/server-validation');

const passport = require('passport');

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const {id: userId} = req.user;
  return Tag.find({userId}).sort({ name: 'desc' })
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', validateParamId, (req, res, next) => {
  const {id: userId} = req.user;
  return Tag.findOne({_id: req.params.id, userId})
    .then(result => {
      if(!result) {
        return next();
      }
      
      return res.json(result);
    })
    .catch(err => next(err));
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', requireFields(['name']), (req, res, next) => {
  const {id: userId} = req.user;
  return Tag.create({name, userId})
    .then(result => {
      return res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err));
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', requireFields(['name']), validateParamAndBodyId, (req, res, next) => {
  const {id: userId} = req.user;
  return Tag.findOneAndUpdate({_id: req.params.id, userId}, {name}, {new: true})
    .then(result => {
      return res.json(result);
    })
    .catch(err => next(err));
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', validateParamId, (req, res, next) => {
  const {id: userId} = req.user;
  return Tag.findOneAndRemove({_id: req.params.id, userId})
    .then(() => res.status(204).end());
});

module.exports = router;