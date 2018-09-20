
const express = require('express');

const Folder = require('../models/folder');

const router = express.Router();

const mongoose = require('mongoose');

router.get('/', (req, res, next) => {
  Folder.find().sort('asc')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

router.get('/:id', (req, res, next) => {
  const {id} = req.params;

  Folder.findOne({_id: id})
    .then(result => {
      return res.json(result);
    })
    .catch(err => next(err));
});

router.put('/:id', (req, res, next) => {
  const {name} = req.body;
  if(!name) {
    const err = new Error('Folder name not specified');
    err.status = 400;
    return next(err);
  }

  Folder.findByIdAndUpdate(req.params.id, {name}, {new: true})
    .then(result => {
      return res.json(result);
    })
    .catch(err => next(err));
});

router.post('/', (req, res, next) => {
  const {name} = req.body;
  if(!name) {
    const err = new Error('Folder name not specified');
    err.status = 400;
    return next(err);
  }

  Folder.create({name})
    .then(result => {
      return res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err));
});

router.delete('/:id', (req, res, next) => {
  Folder.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end());
});

module.exports = router;