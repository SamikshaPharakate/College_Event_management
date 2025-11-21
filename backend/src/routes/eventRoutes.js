const express = require('express');
const auth = require('../middleware/auth');
const { param, query, validationResult } = require('express-validator');
const { getEventById, listEvents } = require('../models/eventModel');
const { registerForEvent, cancelRegistration, listRegistrationsByEvent } = require('../models/registrationModel');
const { User } = require('../models/userModel');

const router = express.Router();

router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('search').optional().isString(),
    query('upcoming').optional().toBoolean()
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const { page = 1, pageSize = 10, search = '', upcoming = false } = req.query;
      // Convert upcoming to boolean if it's a string
      const upcomingBool = upcoming === 'true' || upcoming === true;
      const result = await listEvents({ page, pageSize, search, upcoming: upcomingBool });
      res.json(result);
    } catch (err) { next(err); }
  }
);

router.get('/:id', [param('id').isMongoId()], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const event = await getEventById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) { next(err); }
});

router.post('/:id/register', auth, [param('id').isMongoId()], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    await registerForEvent(req.user.id, req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
});

// Get events with registrations (Admin only)
router.get('/admin/with-registrations', auth, async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const result = await listEvents({ page: 1, pageSize: 1000, upcoming: false });
    const items = (result && Array.isArray(result.items)) ? result.items : [];

    // Get registrations for each event
    const eventsWithRegistrations = await Promise.all(
      items.map(async (event) => {
        const registrations = await listRegistrationsByEvent(event.id);
        // Attach user details (already included by listRegistrationsByEvent via populate)
        const registrationsWithUserDetails = await Promise.all(
          registrations.map(async (reg) => {
            // Ensure user field exists in expected shape
            if (reg.user_name || reg.user_email) {
              return {
                ...reg,
                user: { name: reg.user_name || null, email: reg.user_email || null },
              };
            }
            const user = await User.findById(reg.user_id).select('name email');
            return {
              ...reg,
              user: user ? { name: user.name, email: user.email } : null,
            };
          })
        );
        return {
          ...event,
          registrations: registrationsWithUserDetails,
        };
      })
    );

    res.json({ events: eventsWithRegistrations });
  } catch (err) { next(err); }
});

router.post('/:id/cancel', auth, [param('id').isMongoId()], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    await cancelRegistration(req.user.id, req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
});

module.exports = router;
