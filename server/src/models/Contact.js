const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    userId: { type: String, required: true, index: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true, default: '' },
    email: { type: String, lowercase: true, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    company: { type: String, trim: true, default: '' },
    designation: { type: String, trim: true, default: '' },
    tags: { type: [String], default: [] },
    notes: { type: String, trim: true, default: '' },
    photoUrl: { type: String, default: '' },
    isFavorite: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    followUpDate: { type: String, default: null },
  },
  { timestamps: true }
);

// Required indexes per project specification
contactSchema.index({ userId: 1, email: 1 });
contactSchema.index({ userId: 1, phone: 1 });
contactSchema.index({ userId: 1, isDeleted: 1, createdAt: -1 });

contactSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.models.Contact || mongoose.model('Contact', contactSchema);
