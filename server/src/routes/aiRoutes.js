const express = require('express');
const { getAIInsights } = require('../controllers/aiController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/insights', authMiddleware, getAIInsights);

module.exports = router;
