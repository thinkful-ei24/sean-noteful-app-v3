
const mongoose = require('mongoose');

const middleware = {
  requireFields: (reqFields) => (req, res, next) => {
    for(let field of reqFields) {
      if(!field) {
        const err = new Error(`Missing \`${field}\` in request body`);
        err.status = 400;
        return err;
      }
    }
  },

  validateObjectIdArray: (objectIds) => {
    for(let id of objectIds) {
      if(!mongoose.Types.ObjectId.isValid(id)) {
        const err = new Error('A tag id is not valid');
        err.status = 400;
        return err;
      }
    }
  },

  validateParamId: (req, res, next) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
      const err = new Error('The note id provided in the URL is not valid');
      err.status = 404;
      return err;
    }
  },

  validateBodyId: (req, res, next) => {
    if(!mongoose.Types.ObjectId.isValid(req.body.id)) {
      console.log(bodyId);
      const err = new Error('The note id provided in the request body is not valid');
      err.status = 400;
      return err;
    }
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
        return err;
      }
    }
  }
};

module.exports = middleware;