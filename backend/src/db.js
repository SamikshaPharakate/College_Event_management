const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User } = require('./models/userModel');

async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/event_mgmt';
  await mongoose.connect(uri);

  const admin = await User.findOne({ role: 'admin' }).lean();
  if (!admin) {
    const password_hash = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@12345', 10);
    await User.create({
      name: process.env.DEFAULT_ADMIN_NAME || 'Admin',
      email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com',
      password_hash,
      role: 'admin'
    });
  }
}

module.exports = { connectDB };
