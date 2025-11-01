const express = require('express');
const auth = require('../middleware/auth');
const { listRegistrationsByUser } = require('../models/registrationModel');
const { getById } = require('../models/userModel');

const router = express.Router();

router.get('/profile', auth, async (req, res, next) => {
  try {
    const user = await getById(req.user.id);
    res.json(user);
  } catch (err) { next(err); }
});

router.get('/registrations', auth, async (req, res, next) => {
  try {
    const regs = await listRegistrationsByUser(req.user.id);
    res.json({ items: regs });
  } catch (err) { next(err); }
});

module.exports = router;
