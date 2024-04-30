const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  college: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
});

const Data = mongoose.model('Data', dataSchema);

module.exports = Data;
