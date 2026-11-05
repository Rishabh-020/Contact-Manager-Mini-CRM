let mongoose;
try {
  mongoose = require("mongoose");
} catch {
  mongoose = {
    Schema: class Schema {
      constructor(def, opts) { this.definition = def; this.options = opts; }
      index() {}
      set() {}
    },
    model: (name, schema) => ({ modelName: name, schema }),
    models: {},
    Types: { ObjectId: class ObjectId { toString() { return require("crypto").randomUUID(); } } }
  };
}

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = (mongoose.models && mongoose.models.User) || mongoose.model("User", userSchema);
