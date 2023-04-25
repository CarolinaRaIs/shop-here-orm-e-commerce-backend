const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint
// In insomnia: http://localhost:3001/api/categories
router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    //use the Category model to find all categories 
    //and include each category's associated products using the Product model.
    const categories = await Category.findAll({
      include: [
        {
          model: Product
        }
      ]
    });
    // Then it will return the list of categories in JSON format 
    // to the client with a 200 status code
    res.json(categories);  
  } catch (error) {
    res.status(500).json(error)
  }
});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
});

router.post('/', (req, res) => {
  // create a new category
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
