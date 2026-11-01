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

const followUpSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    userId: { type: String, required: true, index: true },
    contactId: { type: String, required: true, index: true },
    description: { type: String, required: true, trim: true },
    dueDate: { type: String, required: true },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    status: { type: String, enum: ["pending", "completed"], default: "pending" },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

followUpSchema.index({ userId: 1, status: 1, dueDate: 1 });

followUpSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = (mongoose.models && mongoose.models.FollowUp) || mongoose.model("FollowUp", followUpSchema);
