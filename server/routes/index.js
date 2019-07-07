const express = require('express');
const router = express.Router();

router.use(require('./user'));
router.use(require('./category'));
router.use(require('./product'));
router.use(require('./login'));
router.use(require('./upload'));
router.use(require('./images'));

module.exports = router;