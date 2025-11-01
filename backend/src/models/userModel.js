const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password_hash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], required: true, default: 'user' }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

const toPublic = (doc) => ({ id: String(doc._id), name: doc.name, email: doc.email, role: doc.role, created_at: doc.created_at });

const createUser = async (name, email, passwordHash, role = 'user') => {
  const doc = await User.create({ name, email, password_hash: passwordHash, role });
  return toPublic(doc);
};

const findByEmail = async (email) => {
  const doc = await User.findOne({ email }).lean();
  if (!doc) return null;
  return { id: String(doc._id), name: doc.name, email: doc.email, role: doc.role, password_hash: doc.password_hash, created_at: doc.created_at };
};

const getById = async (id) => {
  const doc = await User.findById(id).lean();
  if (!doc) return null;
  return { id: String(doc._id), name: doc.name, email: doc.email, role: doc.role, created_at: doc.created_at };
};

module.exports = { createUser, findByEmail, getById, User };
