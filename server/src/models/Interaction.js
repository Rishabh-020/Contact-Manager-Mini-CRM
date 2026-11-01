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

const interactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: true },
    type: { type: String, enum: ['call', 'email', 'meeting', 'note'], required: true },
    title: { type: String, trim: true, default: '' },
    note: { type: String, required: true, trim: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

interactionSchema.index({ userId: 1, contactId: 1, date: -1 });

module.exports = mongoose.model('Interaction', interactionSchema);
