
const mongoose = require('mongoose');

const middleware = {
  requireFields: (reqFields) => (req, res, next) => {
    for(let field of reqFields) {
      if(!(field in req.body)) {
        const err = new Error(`Missing \`${field}\` in request body`);
        err.status = 400;
        return next(err);
      }
      if(req.body[field] === '') {
        const err = new Error(`Missing \`${field}\` contents in request body`);
        err.status = 400;
        return next(err);
      }
    }
    console.log('ok on requireFields');
    return next();
  },

  // Allows an empty array
  // Doesn't check for the existence of the tag field. Use requireFields
  validateTagIds: (req, res, next) => {
    const {tags} = req.body;
    // skip if null or an empty array
    if(tags === undefined) {
      console.log('return a');
      req.body.tags = [];
      return next();
    }

    for(let id of req.body.tags) {
      if(!mongoose.Types.ObjectId.isValid(id)) {
        const err = new Error('A tag id is not valid');
        err.status = 400;
        console.log('return c');
        return next(err);
      }
    }

    return next();
  },

  // Doesn't check for the existence of the folderId field
  validateFolderId: (req, res, next) => {
    console.log('reached folder id');
    const {folderId} = req.body;
    // skip if null or an empty string
    if(!folderId) {
      console.log('return d');
      return next();
    }
    if(!mongoose.Types.ObjectId.isValid(folderId)) {
      const err = new Error('`folderId` is not set to a valid id');
      err.status = 400;
      console.log('return e');
      return next(err);
    }
    return next();
  },

  // TODO: remove
  validateParamId: (req, res, next) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
      const err = new Error('The note id provided in the URL is not valid');
      err.status = 400;
      return next(err);
    }
    return next();
  },

  // TODO: remove
  validateBodyId: (req, res, next) => {
    if(!mongoose.Types.ObjectId.isValid(req.body.id)) {
      const err = new Error('The note id provided in the request body is not valid');
      err.status = 400;
      return next(err);
    }
    return next();
  },

  validateParamAndBodyId: (req, res, next) => {
    const {id: bodyId} = req.body;
    const {id: paramId} = req.params;

    if(bodyId) {
      if(!mongoose.Types.ObjectId.isValid(req.body.id)) {
        const err = new Error('The id is not valid');
        err.status = 400;
        return next(err);
      }
    }

    if(paramId) {
      if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
        const err = new Error('The id is not valid');
        err.status = 400;
        return next(err);
      }
    }

    if((paramId && bodyId) && (paramId !== bodyId)) {
      const err = new Error('Note id does not match. Check the note id in the request \
        body and in the URL');
      err.status = 400;
      return next(err);
    }

    return next();
  }

  
};

module.exports = middleware;