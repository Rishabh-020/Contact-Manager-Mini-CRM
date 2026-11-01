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

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    role: { type: String, default: 'user' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
