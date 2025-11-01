const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    capacity: { type: Number, required: true, min: 0 },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

const toPublic = (doc, available) => ({
  id: String(doc._id),
  title: doc.title,
  description: doc.description ?? null,
  location: doc.location ?? null,
  start_time: doc.start_time,
  end_time: doc.end_time,
  capacity: doc.capacity,
  created_by: doc.created_by ? String(doc.created_by) : null,
  created_at: doc.created_at,
  available_seats: available
});

async function registeredCountFor(eventId) {
  const Registration = mongoose.models.Registration;
  if (!Registration) return 0;
  return Registration.countDocuments({ event_id: eventId, status: 'registered' });
}

const createEvent = async (data) => {
  const payload = {
    title: data.title,
    description: data.description ?? undefined,
    location: data.location ?? undefined,
    start_time: new Date(data.start_time),
    end_time: new Date(data.end_time),
    capacity: Number(data.capacity),
    created_by: data.created_by ? new mongoose.Types.ObjectId(data.created_by) : undefined
  };
  const doc = await Event.create(payload);
  const count = await registeredCountFor(doc._id);
  return toPublic(doc, doc.capacity - count);
};

const updateEvent = async (id, fields) => {
  const updates = {};
  const allowed = ['title', 'description', 'location', 'start_time', 'end_time', 'capacity'];
  allowed.forEach(k => {
    if (fields[k] !== undefined) updates[k] = fields[k];
  });
  if (updates.start_time) updates.start_time = new Date(updates.start_time);
  if (updates.end_time) updates.end_time = new Date(updates.end_time);
  if (updates.capacity !== undefined) updates.capacity = Number(updates.capacity);
  const doc = await Event.findByIdAndUpdate(id, updates, { new: true }).lean();
  if (!doc) return null;
  const count = await registeredCountFor(doc._id);
  return toPublic(doc, doc.capacity - count);
};

const deleteEvent = async (id) => {
  const Registration = mongoose.models.Registration;
  if (Registration) await Registration.deleteMany({ event_id: id });
  const res = await Event.findByIdAndDelete(id);
  return !!res;
};

const getEventById = async (id) => {
  const doc = await Event.findById(id).lean();
  if (!doc) return null;
  const count = await registeredCountFor(doc._id);
  return toPublic(doc, doc.capacity - count);
};

const listEvents = async ({ page = 1, pageSize = 10, search = '', upcoming = false } = {}) => {
  const filter = {};
  if (search) {
    const rx = new RegExp(search, 'i');
    filter.$or = [{ title: rx }, { description: rx }, { location: rx }];
  }
  if (upcoming) {
    filter.start_time = { $gte: new Date() };
  }
  const total = await Event.countDocuments(filter);
  const docs = await Event.find(filter)
    .sort({ start_time: 1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean();

  const ids = docs.map(d => d._id);
  let countsById = {};
  const Registration = mongoose.models.Registration;
  if (Registration && ids.length) {
    const agg = await Registration.aggregate([
      { $match: { event_id: { $in: ids }, status: 'registered' } },
      { $group: { _id: '$event_id', count: { $sum: 1 } } }
    ]);
    agg.forEach(a => { countsById[String(a._id)] = a.count; });
  }
  const items = docs.map(doc => toPublic(doc, doc.capacity - (countsById[String(doc._id)] || 0)));
  return { items, page, pageSize, total };
};

module.exports = { createEvent, updateEvent, deleteEvent, getEventById, listEvents, Event };
