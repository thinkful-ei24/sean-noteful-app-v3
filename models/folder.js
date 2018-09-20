const moongoose = require('mongoose');

const folderSchema = new moongoose.Schema({
  name: {type: String, required: true, unique: true}
});

folderSchema.set('timestamps', true);

folderSchema.virtual('id').get(function() {
  return this._id;
});

folderSchema.set('toObject', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = moongoose.model('Folder', folderSchema);