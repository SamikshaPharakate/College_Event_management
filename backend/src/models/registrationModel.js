const mongoose = require('mongoose');
const { Event } = require('./eventModel');

const registrationSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    status: { type: String, enum: ['registered', 'cancelled'], default: 'registered', required: true }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

registrationSchema.index({ user_id: 1, event_id: 1 }, { unique: true });

const Registration = mongoose.models.Registration || mongoose.model('Registration', registrationSchema);

const registerForEvent = async (userId, eventId) => {
  const event = await Event.findById(eventId).lean();
  if (!event) { const err = new Error('Event not found'); err.status = 404; throw err; }

  const registeredCount = await Registration.countDocuments({ event_id: eventId, status: 'registered' });
  if (registeredCount >= event.capacity) { const err = new Error('Event is full'); err.status = 400; throw err; }

  const existing = await Registration.findOne({ user_id: userId, event_id: eventId });
  if (existing && existing.status === 'registered') { const err = new Error('Already registered'); err.status = 409; throw err; }
  if (existing) {
    existing.status = 'registered';
    await existing.save();
    return true;
  }
  await Registration.create({ user_id: userId, event_id: eventId, status: 'registered' });
  return true;
};

const cancelRegistration = async (userId, eventId) => {
  const existing = await Registration.findOne({ user_id: userId, event_id: eventId, status: 'registered' });
  if (!existing) { const err = new Error('Not registered'); err.status = 400; throw err; }
  existing.status = 'cancelled';
  await existing.save();
  return true;
};

const listRegistrationsByEvent = async (eventId) => {
  const regs = await Registration.find({ event_id: eventId })
    .sort({ created_at: -1 })
    .populate({ path: 'user_id', select: 'name email' })
    .lean();
  return regs.map(r => ({
    id: String(r._id),
    status: r.status,
    created_at: r.created_at,
    user_id: String(r.user_id?._id || r.user_id),
    user_name: r.user_id?.name,
    user_email: r.user_id?.email
  }));
};

const listRegistrationsByUser = async (userId) => {
  const regs = await Registration.find({ user_id: userId })
    .sort({ created_at: -1 })
    .populate({ path: 'event_id', select: 'title start_time end_time location' })
    .lean();
  return regs.map(r => ({
    id: String(r._id),
    status: r.status,
    created_at: r.created_at,
    event_id: String(r.event_id?._id || r.event_id),
    title: r.event_id?.title,
    start_time: r.event_id?.start_time,
    end_time: r.event_id?.end_time,
    location: r.event_id?.location
  }));
};

module.exports = { registerForEvent, cancelRegistration, listRegistrationsByEvent, listRegistrationsByUser, Registration };
