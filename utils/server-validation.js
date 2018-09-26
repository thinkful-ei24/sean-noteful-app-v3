
const mongoose = require('mongoose');

const middleware = {
  requireFields: (reqFields) => (req, res, next) => {
    for(let field of reqFields) {
      if(!(field in req.body)) {
        const err = new Error(`Missing \`${field}\` in request body`);
        err.status = 400;
        return next(err);
      }
    }
    return next();
  },

  // Allows an empty array
  // Doesn't check for the existence of the tag field. Use requireFields
  validateTagIds: (req, res, next) => {
    if(!Array.isArray(req.body.tags)) {
      const err = new Error('`tags` must be an array');
      err.status = 400;
      return next(err);
    }

    for(let id of req.body.tags) {
      if(!mongoose.Types.ObjectId.isValid(id)) {
        const err = new Error('A tag id is not valid');
        err.status = 400;
        return next(err);
      }
    }

    return next();
  },

  // Doesn't check for the existence of the folderId field
  validateFolderId: (req, res, next) => {
    if(!mongoose.Types.ObjectId.isValid(req.body.folderId)) {
      const err = new Error('`folderId` is not set to a valid id');
      err.status = 400;
      return next(err);
    }
    return next();
  },

  validateParamId: (req, res, next) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
      const err = new Error('The note id provided in the URL is not valid');
      err.status = 404;
      return next(err);
    }
    return next();
  },

  validateBodyId: (req, res, next) => {
    if(!mongoose.Types.ObjectId.isValid(req.body.id)) {
      const err = new Error('The note id provided in the request body is not valid');
      err.status = 400;
      return next(err);
    }
    return next();
  },

  validateParamAndBodyId: (req, res, next) => {
    // check to see if both ids are valid
    if(this.validateParamId(req, res, next)
      && this.validateBodyId(req, res, next)) {
      // check to see if they match
      if(req.params.id !== req.body.id) {
        const err = new Error('Note id does not match. Check the note id in the request \
          body and in the URL');
        err.status = 400;
        return next(err);
      }
    }
    return next();
  }
};

module.exports = middleware;