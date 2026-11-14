const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    role: { type: String, default: 'user' },
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
