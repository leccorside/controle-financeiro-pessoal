const express = require('express');
const NotificationController = require('../controllers/NotificationController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rotas para usuários logados
router.post('/subscribe', authMiddleware, NotificationController.subscribe);
router.post('/unsubscribe', authMiddleware, NotificationController.unsubscribe);

// Rotas Administrativas
router.post('/send-custom', authMiddleware, adminMiddleware, NotificationController.sendCustom);
router.post('/run-overdue-job', authMiddleware, adminMiddleware, NotificationController.runOverdueJob);

module.exports = router;
