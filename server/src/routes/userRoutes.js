const express = require('express');
const { getUsers, createUser, updateUser, deleteUser, updateProfile } = require('../controllers/userController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rota de perfil (qualquer usuário logado)
router.put('/profile', authMiddleware, updateProfile);

// Rotas Administrativas (apenas ADMIN)
router.use(authMiddleware, adminMiddleware);

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
