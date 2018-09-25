'use strict';

const express = require('express');

const mongoose = require('mongoose');

const Note = require('../models/note');

const router = express.Router();

// title, content, folderId, tags

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const {searchTerm, folderId, tagId} = req.query;
  let filter = {};

  if(searchTerm) {
    const expr = RegExp(searchTerm, 'gi');
    filter = {$or: [{'title': expr}, {'content': expr}]};
  }

  if(folderId) {
    filter.folderId = folderId;
  }

  if(tagId) {
    filter.tagId = tagId;
  }

  Note.find(filter).sort({ updatedAt: 'desc' })
    .populate('tags')
    .populate('folderId')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  const {id} = req.params;
  const err = validatePassedIds(id);
  if(err) {
    return next(err);
  }

  Note.findById(id)
    .populate('tags')
    .populate('folderId')
    .then(result => {
      return res.json(result);
    })
    .catch(err => next(err));
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const {title, content, folderId, tags} = req.body;
  const err = validateNoteInput(title, content, folderId, tags);
  if(err) {
    return next(err);
  }

  const newNote = {
    title,
    content,
    folderId: folderId ? folderId : null,
    tags: tags ? tags : []
  };

  Note.create(newNote)
    .then(result => {
      return res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err));
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const {title, content, folderId, tags, bodyId} = req.body;
  const {id} = req.params;
  const err = validateNoteInput(title, content, folderId, tags);
  if(err) {
    return next(err);
  }
  const idErr = validatePassedIds(id, bodyId);
  if(idErr) {
    return next(err);
  }

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

  Note.findByIdAndUpdate(req.params.id, updatedNote, {new: true})
    .then(result => {
      return res.json(result);
    })
    .catch(err => next(err));
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  const {id} = req.params;
  const err = validatePassedIds(id);
  if(err) {
    console.log(err);
    return next(err);
  }
  Note.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end());
});

module.exports = router;
