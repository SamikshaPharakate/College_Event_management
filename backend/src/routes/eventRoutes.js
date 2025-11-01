const express = require('express');
const auth = require('../middleware/auth');
const { param, query, validationResult } = require('express-validator');
const { getEventById, listEvents } = require('../models/eventModel');
const { registerForEvent, cancelRegistration } = require('../models/registrationModel');

const router = express.Router();

router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('search').optional().isString(),
    query('upcoming').optional().isBoolean().toBoolean()
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const { page = 1, pageSize = 10, search = '', upcoming = false } = req.query;
      const result = await listEvents({ page, pageSize, search, upcoming });
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

router.post('/:id/cancel', auth, [param('id').isMongoId()], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    await cancelRegistration(req.user.id, req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
});

module.exports = router;
