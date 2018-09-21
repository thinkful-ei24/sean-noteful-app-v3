const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {type: String, required: true, unique: true},

});

tagSchema.set('timestamps', true);

tagSchema.virtual('id').get(function() {
  return this._id;
});

tagSchema.set('toObject', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Tag', tagSchema);