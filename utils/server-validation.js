
const mongoose = require('mongoose');

const middleware = {
  requireFields: (reqFields) => (req, res, next) => {
    for(let field of reqFields) {
      if(!field) {
        const err = new Error(`Missing \`${field}\` in request body`);
        err.status = 400;
        return next(err);
      }
    }
    return next();
  },

  validateObjectIdArray: (objectIds) => (req, res, next) => {
    for(let id of objectIds) {
      if(!mongoose.Types.ObjectId.isValid(id)) {
        const err = new Error('A tag id is not valid');
        err.status = 400;
        return next(err);
      }
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