const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// get all tags
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll({
      include: [
        {
          model: Product,
          attributes: ['id', 'product_name', 'price', 'stock'],
          through: ProductTag,
        },
      ],
    });

    res.json(tags);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// get one tag
router.get('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          attributes: ['id', 'product_name', 'price', 'stock'],
          through: ProductTag,
        },
      ],
    });

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.json(tag);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// create new tag
router.post('/', async (req, res) => {
  try {
    const tag = await Tag.create(req.body);

    res.status(200).json(tag);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

// update tag
router.put('/:id', async (req, res) => {
  try {
    const [rowsAffected, updatedTags] = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
      returning: true,
    });

    if (rowsAffected === 0) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.json({ message: 'Tag updated successfully', updatedTag: updatedTags[0] });
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

// delete tag
router.delete('/:id', async (req, res) => {
  try {
    const rowsAffected = await Tag.destroy({
      where: { id: req.params.id },
    });

    if (rowsAffected === 0) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
