const mongoose = require('mongoose');
const temp = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
});

const TempId = mongoose.model('temp', temp);

module.exports = TempId;