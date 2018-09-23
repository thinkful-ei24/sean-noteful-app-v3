'use strict';

const express = require('express');

const mongoose = require('mongoose');

const Note = require('../models/note');

const router = express.Router();

function validateNoteInput(title, content, folderId, tags) {
  let err;

  if(!title) {
    err = new Error('Missing `title` in request body');
    err.status = 400;
    return err;
  }
  
  if (!content) {
    err = new Error('Missing `content` in request body');
    err.status = 400;
    return err;
  }

  console.log(tags);
  if(tags) {
    for(let tagId of tags) {
      if(!mongoose.Types.ObjectId.isValid(tagId)) {
        const err = new Error('A tag id is not valid');
        err.status = 400;
        return err;
      }
    }
  }
}

function validatePassedIds(paramId) {
	let bodyId;
	if(arguments.length == 2) {
		bodyId = arguments[1];
	}
	if(!mongoose.Types.ObjectId.isValid(paramId)) {
		const err = new Error('The note id provided in the URL is not valid')
		err.status = 400;
		return err;
	}
	if(bodyId !== 'undefined' && !mongoose.Types.ObjectId.isValid(bodyId) {
		const err = new Error('The note id provided in the request body is not valid');
		err.status = 400'
		return err;
	}
	if(bodyId !== 'undefined' && (paramId !== bodyId)) {
		const err = new Error('Note id does not match. Check the note id in the request \
			'body and in the URL');
	}
}

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

  Note.findById(req.params.id)
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
  const {title, content} = req.body;
  const err = validateNoteInput(title, content, folderId, tags);
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
	const {id} = req.params;
	const err = validatePassedIds(id);
	if(err {
		next(err)
	}
	Note.findByIdAndRemove(req.params.id)
    		.then(() => res.status(204).end());
});

module.exports = router;
