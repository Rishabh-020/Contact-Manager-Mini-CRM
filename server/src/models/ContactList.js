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

const contactListSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    color: { type: String, default: 'blue' },
    contactIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }],
  },
  { timestamps: true }
);

contactListSchema.index({ userId: 1, name: 1 });

module.exports = mongoose.model('ContactList', contactListSchema);
