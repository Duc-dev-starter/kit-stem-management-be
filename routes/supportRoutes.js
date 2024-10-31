const express = require('express');
const { supportController } = require('../controllers');
const { authMiddleWare } = require('../middleware');
const { UserRoleEnum } = require('../consts');
const router = express.Router();

router.post('/request', supportController.requestSupportController);
router.get('/lab', supportController.getLabWithSupportHistoryController);
router.post('/reply', authMiddleWare([UserRoleEnum.STAFF]), supportController.replyToSupportController);

module.exports = router;
