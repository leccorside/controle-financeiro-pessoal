const express = require('express');
const { 
  getTransactions, 
  createTransaction, 
  updateTransaction, 
  deleteTransaction,
  getSummary,
  getUpcomingAlerts
} = require('../controllers/transactionController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getTransactions);
router.get('/summary', getSummary);
const { checkUpcomingExpenses } = require('../services/cronService');

router.get('/alerts', getUpcomingAlerts);
router.get('/test-push', async (req, res) => {
  try {
    console.log('[TEST] Iniciando disparo manual de push...');
    await checkUpcomingExpenses();
    res.json({ 
      success: true, 
      message: 'Processamento de push concluído. Verifique se recebeu a notificação.' 
    });
  } catch (error) {
    console.error('[TEST] Erro no disparo manual:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});
router.post('/', createTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
