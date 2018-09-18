'use strict';

const express = require('express');

const Note = require('../models/note');

const router = express.Router();

function validateInput(title, content) {
  const requiredFields = ['title', 'content'];
  requiredFields.forEach(field => {
    if(!field) {
      const err = new Error(`Missing field '${field}' in req body`);
      err.status = 400;
      return err;
    }
  });
}

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const {searchTerm} = req.query;
  let filter = {};

  if(searchTerm) {
    const expr = RegExp(searchTerm, 'gi');
    filter = {$or: [{'title': expr}, {'content': expr}]};
  }

  Note.find(filter).sort({ updatedAt: 'desc' })
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  Note.findById(req.params.id)
    .then(result => {
      return res.json(result);
    })
    .catch(err => next(err));
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const {title, content} = req.body;
  const err = validateInput(title, content);
  if(err) {
    return next(err);
  }

  Note.create({title, content})
    .then(result => {
      return res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err));
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const {title, content} = req.body;
  const err = validateInput(title, content);
  if(err) {
    return next(err);
  }

  Note.findByIdAndUpdate(req.params.id, {title, content}, {new: true})
    .then(result => {
      return res.json(result);
    })
    .catch(err => next(err));
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  Note.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end());
});

module.exports = router;