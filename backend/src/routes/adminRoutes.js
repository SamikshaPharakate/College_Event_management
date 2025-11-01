const express = require('express');
const { body, param, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const { createEvent, updateEvent, deleteEvent } = require('../models/eventModel');
const { listRegistrationsByEvent } = require('../models/registrationModel');

const router = express.Router();

router.use(auth, requireRole('admin'));

router.post(
  '/events',
  [
    body('title').isLength({ min: 3 }).trim(),
    body('description').optional().isString(),
    body('location').optional().isString(),
    body('start_time').isISO8601(),
    body('end_time')
      .isISO8601()
      .custom((end, { req }) => new Date(end) > new Date(req.body.start_time))
      .withMessage('end_time must be after start_time'),
    body('capacity').isInt({ min: 0 }).toInt()
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const event = await createEvent({ ...req.body, created_by: req.user.id });
      res.status(201).json(event);
    } catch (err) { next(err); }
  }
);

router.put(
  '/events/:id',
  [
    param('id').isMongoId(),
    body('title').optional().isLength({ min: 3 }).trim(),
    body('description').optional().isString(),
    body('location').optional().isString(),
    body('start_time').optional().isISO8601(),
    body('end_time')
      .optional()
      .isISO8601()
      .custom((end, { req }) => {
        if (!req.body.start_time) return true;
        return new Date(end) > new Date(req.body.start_time);
      })
      .withMessage('end_time must be after start_time'),
    body('capacity').optional().isInt({ min: 0 }).toInt()
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const updated = await updateEvent(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Event not found' });
      res.json(updated);
    } catch (err) { next(err); }
  }
);

router.delete('/events/:id', [param('id').isMongoId()], async (req, res, next) => {
  try {
    const ok = await deleteEvent(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Event not found' });
    res.json({ success: true });
  } catch (err) { next(err); }
});

router.get('/events/:id/registrations', [param('id').isMongoId()], async (req, res, next) => {
  try {
    const regs = await listRegistrationsByEvent(req.params.id);
    res.json({ items: regs });
  } catch (err) { next(err); }
});

module.exports = router;
