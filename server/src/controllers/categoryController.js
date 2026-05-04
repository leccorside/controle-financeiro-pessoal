const prisma = require('../lib/prisma');

const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        OR: [
          { userId: req.user.id },
          { userId: null } // Categorias globais
        ]
      },
      orderBy: { name: 'asc' }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar categorias.' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, type, color, icon } = req.body;
    const category = await prisma.category.create({
      data: {
        name,
        type,
        color,
        icon,
        userId: req.user.id
      }
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar categoria.' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, color, icon } = req.body;

    // Verificar se a categoria pertence ao usuário
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category || (category.userId && category.userId !== req.user.id)) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name, type, color, icon }
    });
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar categoria.' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({ where: { id } });
    if (!category || (category.userId && category.userId !== req.user.id)) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    await prisma.category.delete({ where: { id } });
    res.json({ message: 'Categoria excluída com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir categoria.' });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
