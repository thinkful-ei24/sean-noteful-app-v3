
const express = require('express');

const Folder = require('../models/folder');

const router = express.Router();

function validateFolderInput() {
  return;
}

router.get('/', (req, res, next) => {
  Folder.find()
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

router.get('/:id', (req, res, next) => {
  Folder.findById(req.params.id)
    .then(result => {
      res.json(result);
    })
    .catch(err => next(err));
});

router.put('/:id', (req, res, next) => {
  const {name} = req.body;
  const err = validateFolderInput(name);
  if(err) {
    return next(err);
  }
});

router.post('/', (req, res, next) => {
  const {name} = req.body;
  const err = validateFolderInput(name);
  if(err) {
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