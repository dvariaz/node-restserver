const express = require('express');
const router = express.Router();

router.use(require('./user'));
router.use(require('./category'));
router.use(require('./product'));
router.use(require('./login'));

module.exports = router;