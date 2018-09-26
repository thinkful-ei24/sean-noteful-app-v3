
const express = require('express');

const Tag = require('../models/tag');

const router = express.Router();

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  return Tag.find().sort({ name: 'desc' })
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  return Tag.findById(req.params.id)
    .then(result => {
      if(!result) {
        return next();
      }
      
      return res.json(result);
    })
    .catch(err => next(err));
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const {name} = req.body;
  if(!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
  }

  return Tag.create({name})
    .then(result => {
      return res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err));
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const {name} = req.body;
  if(!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
  }

  return Tag.findByIdAndUpdate(req.params.id, {name}, {new: true})
    .then(result => {
      return res.json(result);
    })
    .catch(err => next(err));
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', validateParamId, (req, res, next) => {
  return Tag.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end());
});

module.exports = router;