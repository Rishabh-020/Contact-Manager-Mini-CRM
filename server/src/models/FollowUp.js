let mongoose;
try {
  mongoose = require('mongoose');
} catch {
  mongoose = {
    Schema: class Schema {
      constructor(def, opts) { this.definition = def; this.options = opts; }
      index() {}
    },
    model: (name, schema) => ({ modelName: name, schema }),
  };
  mongoose.Schema.Types = { ObjectId: String };
}

const followUpSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: true },
    description: { type: String, required: true, trim: true },
    dueDate: { type: String, required: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

followUpSchema.index({ userId: 1, status: 1, dueDate: 1 });

module.exports = mongoose.model('FollowUp', followUpSchema);
