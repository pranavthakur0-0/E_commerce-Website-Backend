const mongoose = require('mongoose');

const favAccount = new mongoose.Schema({
    personid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'useraccounts',
      },
      favItem : []
})

const FavAccount = mongoose.model('favAccount', favAccount);

module.exports = FavAccount;