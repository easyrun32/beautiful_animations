const express = require('express');
const router = express.Router();
const path = require('path');

/* GET users listing. */
router.get('/', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'admin_page', 'index.html')));

module.exports = router;