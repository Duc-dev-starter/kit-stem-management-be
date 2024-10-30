const express = require('express');
const { supportController } = require('../controllers');
const router = express.Router();

router.post('/request', supportController.requestSupportController);
router.get('/lab/:labId', supportController.getLabWithSupportHistoryController);
router.post('/reply', supportController.replyToSupportController);

module.exports = router;
