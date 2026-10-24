const mongoose = require('mongoose');

const followUpSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    completedAt: Date,
  },
  { timestamps: true }
);

followUpSchema.index({ userId: 1, status: 1, dueDate: 1 });

module.exports = mongoose.model('FollowUp', followUpSchema);
