const mongoose = require('mongoose');

const contactListSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    color: { type: String, default: 'blue' },
    contactIds: { type: [String], default: [] },
  },
  { timestamps: true }
);

contactListSchema.index({ userId: 1, name: 1 });

contactListSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.models.ContactList || mongoose.model('ContactList', contactListSchema);
