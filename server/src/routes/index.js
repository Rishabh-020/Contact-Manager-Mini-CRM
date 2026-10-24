const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => res.json({ success: true, status: 'ok' }));

router.use('/auth', require('./auth.routes'));
router.use('/contacts', require('./contact.routes'));
router.use('/lists', require('./list.routes'));
router.use('/follow-ups', require('./followUp.routes'));
router.use('/dashboard', require('./dashboard.routes'));

module.exports = router;
