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

const interactionSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    userId: { type: String, required: true, index: true },
    contactId: { type: String, required: true, index: true },
    type: { type: String, enum: ["call", "email", "meeting", "note"], required: true },
    title: { type: String, trim: true, default: "" },
    note: { type: String, required: true, trim: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

interactionSchema.index({ userId: 1, contactId: 1, date: -1 });

interactionSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = (mongoose.models && mongoose.models.Interaction) || mongoose.model("Interaction", interactionSchema);
