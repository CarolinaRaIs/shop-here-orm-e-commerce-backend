const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint
// In insomnia: GET http://localhost:3002/api/categories
// categories = function that is used for insomnia link
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
  } catch (err) {
    res.status(500).json(err)
  }
});

// In insomnia: GET http://localhost:3002/api/categories/:id
router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const categoryByID = await Category.findOne ({
      where: {
        id: req.params.id
      },
      include: [
        {
          model: Product
        }
      ]
    });

    if (categoryByID) {
      res.json(categoryByID);
    } else {
      // 404 status = url error (not found)
      res.status(404).json({err: "No category with this ID"});
    }


  } catch (err) {
    // 500 status code = server error
    res.status(500).json(err);
  }
});

// In insomnia: POST http://localhost:3002/api/categories
router.post('/', async (req, res) => {
  // create a new category
  try {
    const newCategory = await Category.create({
      //ARGUMENT:
      // category_name: Snake-case to name db columns- referenced from Category.js model
      // category_name = the value provided in the request body, which represents the name of the new category
      category_name: req.body.category_name
    });
    res.json(newCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});

// In insomnia: PUT http://localhost:3002/api/categories/:id
router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const updatedCategory = await Category.update(req.body, 
      {
      where: {
        id: req.params.id
      }
      });

      if (updatedCategory) {
        res.json(updatedCategory);
      } else {
        //404 status code means that the requested resource (p) is not found
        res.status(404).json({err: "No category with this ID"});
      }

  } catch (err) {
    res.status(500).json(err);
  }
});

// In insomnia: DELETE http://localhost:3002/api/categories/:id
router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const deletedCategory = await Category.destroy(
      {
        where: {
          id: req.params.id
        }
      }
    );
  
    if (deletedCategory) {
      res.json(deletedCategory);
    } else {
      res.status(404).json({err: "No category with this ID"});
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
