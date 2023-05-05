const mongoose = require('mongoose');
const bagAccount = new mongoose.Schema({
    personid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'useraccounts',
      },
      BagItem : []
})

const BagAccount = mongoose.model('bagaccount', bagAccount)
module.exports = BagAccount;