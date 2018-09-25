
const mongoose = require('mongoose');

function validateInput(reqFields) {
  for(field of reqFields) {
    if()
  }
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
  if(arguments.length === 2) {
    bodyId = arguments[1];
  }
  if(!mongoose.Types.ObjectId.isValid(paramId)) {
    const err = new Error('The note id provided in the URL is not valid');
    err.status = 404;
    return err;
  }
  if(bodyId !== undefined && !mongoose.Types.ObjectId.isValid(bodyId)) {
    console.log(bodyId);
    const err = new Error('The note id provided in the request body is not valid');
    err.status = 400;
    return err;
  }
  if(bodyId !== undefined && (paramId !== bodyId)) {
    const err = new Error('Note id does not match. Check the note id in the request \
      body and in the URL');
    err.status = 400;
    return err;
  }
}