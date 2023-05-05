const mongoose = require('mongoose');

const subLinkSchema = new mongoose.Schema({
  link: {
    type: String,
    required: true,
  },
});

const LinkGroup = new mongoose.Schema({
  gender: {
    type: String,
    required: [true, "gender is required"],
  },
  headlinks:  {
    type: String,
    required: [true, "headerLink is required"],
  },
  priority: {
    type: Number,
    required: [true, "Priority is required"],
  },
  sublinks: [subLinkSchema],
});

// Middleware function to check for duplicate gender and headlinks values before saving
LinkGroup.pre('save', async function(next) {
  const linkGroup = this;
  try {
    // Check if there is another document with the same gender and headlinks values
    const duplicate = await mongoose.models.navLinks.findOne({gender: linkGroup.gender, headlinks: linkGroup.headlinks});
    if (duplicate) {
      // If a duplicate document is found, generate a validation error and prevent saving
      const error = new Error('Duplicate gender and headlinks values');
      error.name = 'ValidationError';
      next(error);
    } else {
      // If no duplicate is found, continue with saving
      next();
    }
  } catch (err) {
    // Handle any errors that occur during the validation process
    next(err);
  }
});

const NavLinks = mongoose.model('navLinks', LinkGroup);

module.exports = NavLinks;
