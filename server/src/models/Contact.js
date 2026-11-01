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

const contactSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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

contactSchema.index({ userId: 1, isDeleted: 1, createdAt: -1 });

module.exports = mongoose.model('Contact', contactSchema);
