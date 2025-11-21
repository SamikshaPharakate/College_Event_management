const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User } = require('./models/userModel');

async function connectDB() {
  try {
    let uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/event_mgmt';
    const dbName = process.env.MONGO_DB_NAME || 'event_mgmt';

    // Ensure a database name is present for both local and Atlas URIs
    // 1) Local URI without db -> append /event_mgmt
    if (/^mongodb:\/\//i.test(uri) && !/\/(?!.*@).*\w/.test(uri.split('?')[0])) {
      // e.g. mongodb://127.0.0.1:27017 -> mongodb://127.0.0.1:27017/event_mgmt
      const [base, query = ''] = uri.split('?');
      uri = `${base.replace(/\/?$/, '/') }${dbName}${query ? `?${query}` : ''}`;
    }
    // 2) Atlas SRV without db -> append /event_mgmt before query
    if (/^mongodb\+srv:\/\//i.test(uri)) {
      const [base, query = ''] = uri.split('?');
      // if there is no path segment after the host(s), add one
      const hasDbPath = /mongodb\.net\/.+$/i.test(base);
      if (!hasDbPath) {
        uri = `${base.replace(/\/?$/, '/') }${dbName}${query ? `?${query}` : ''}`;
      }
    }

    mongoose.set('strictQuery', true);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log('MongoDB connected');

    // Seed default admin if not present
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
    const existing = await User.findOne({ email: adminEmail });
    if (!existing) {
      const password_hash = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@12345', 10);
      await User.create({
        name: process.env.DEFAULT_ADMIN_NAME || 'Admin',
        email: adminEmail,
        password_hash,
        role: 'admin'
      });
    } else if (existing.role !== 'admin') {
      existing.role = 'admin';
      await existing.save();
    }
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    throw err; // Propagate so server startup fails fast and visibly
  }
}

module.exports = { connectDB };
