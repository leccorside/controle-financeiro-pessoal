const express = require('express');
const { 
  getTransactions, 
  createTransaction, 
  updateTransaction, 
  deleteTransaction,
  getSummary 
} = require('../controllers/transactionController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getTransactions);
router.get('/summary', getSummary);
router.post('/', createTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
