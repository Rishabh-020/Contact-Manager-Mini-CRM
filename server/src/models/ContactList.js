const mongoose = require('mongoose');

const contactListSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    description: String,
    contactIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContactList', contactListSchema);
