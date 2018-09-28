'use strict';


const mongoose = require('mongoose');
const Note = require('../models/note');

const express = require('express');
const router = express.Router();

const {requireFields, validateParamAndBodyId, validateFolderId,
  validateParamId, validateTagIds} = require('../utils/server-validation');

const passport = require('passport');

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const {searchTerm, folderId, tagId} = req.query;
  const {id: userId} = req.user;

  let filter = { userId };

  if(searchTerm) {
    const expr = RegExp(searchTerm, 'gi');
    filter = {$or: [{'title': expr}, {'content': expr}]};
  }

  if(folderId) {
    filter.folderId = folderId;
  }

  if(tagId) {
    filter.tags = tagId;
  }

  return Note.find(filter).sort({ updatedAt: 'desc' })
    .populate('tags')
    .populate('folderId')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', validateParamId, (req, res, next) => {
  const {id} = req.params;
  const {id: userId} = req.user;
  
  return Note.findOne({_id: id, userId})
    .populate('tags')
    .populate('folderId')
    .then(result => {
      if(!result) {
        const err = new Error('Note id does not exist');
        err.status = 404;
        return next(err);
      }
      return res.json(result);
    })
    .catch(err => next(err));
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', requireFields(['title']),
  validateTagIds, validateFolderId, (req, res, next) => {
    const {title, content, folderId, tags} = req.body;
    const {id: userId} = req.user;

    const newNote = {
      title,
      content: content ? content : '',
      userId,
      folderId: folderId ? folderId : null,
      tags: tags ? tags : []
    };

    return Note.create(newNote)
      .then(result => {
        return res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
      })
      .catch(err => next(err));
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', requireFields(['title', 'content', 'tags'],
  validateFolderId, validateTagIds, validateParamAndBodyId), (req, res, next) => {
  const {title, content, folderId, tags} = req.body;
  const {id} = req.params;
  const {id: userId} = req.user;

  let updatedNote = {
    title, content
  };

  // TODO: are these checks necessary?
  if(folderId) {
    updatedNote.folderId = folderId;
  }

  if(tags) {
    updatedNote.tags = tags;
  }

  return Note.findOneAndUpdate({_id: id, userId}, updatedNote, {new: true})
    .then(result => {
      return res.json(result);
    })
    .catch(err => next(err));
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', validateParamId, (req, res, next) => {
  const {id: userId} = req.user;
  return Note.findOneAndRemove({_id: req.params.id, userId})
    .then(() => res.status(204).end());
});

module.exports = router;
