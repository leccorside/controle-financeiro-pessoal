const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/ReportController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get('/comparison', authMiddleware, ReportController.getComparison);

module.exports = router;
