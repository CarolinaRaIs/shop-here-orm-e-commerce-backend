const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint
// In insomnia: GET http://localhost:3002/api/products
router.get('/', async(req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const products = await Product.findAll({
      //The Product model has associations with both the Category and Tag models
      include: [
        {
          model:Category
        },
        {
          model: Tag
        }
      ]
    });
    res.json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
// In insomnia: GET http://localhost:3002/api/products/:id
router.get('/:id', async(req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const productByID = await Product.findOne({
      where: {
        id: req.params.id
      },

      include: [
        {
          model: Category
        },

        {
          model: Tag
        }
      ]
    });

    //If a product is found (truthy), it is sent back to the client in 
    // JSON format with a 200 status code
    // else, send a 404 status code and an error message
    if (productByID) {
      res.json(productByID);
    } else {
      res.status(404).json({err: "No product with this ID"});
    }

  } catch (err) {
    res.status(500).json(err);
  }

});

// create new product
// In insomnia: POST http://localhost:3002/api/products
router.post('/', async(req, res) => {
  /* req.body should look like this...
    {
      "product_name": "Basketball",
      "price": 200,
      "stock": 3,
      "tagIds": [1, 2, 3, 4]
    }
  */

  Product.create({
    product_name: req.body.product_name,
    price: req.body.price,
    stock: req.body.stock,
    tagIds: req.body.tagIds})
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArray = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArray);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
// In insomnia: PUT http://localhost:3002/api/products/:id
router.put('/:id', async(req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

// In insomnia: DELETE http://localhost:3002/api/products/:id
router.delete('/:id', async(req, res) => {
  // delete one product by its `id` value
  try {
    const deletedProduct = await Product.destroy({
      where: {
        id: req.params.id
      }
    });

    //If a deleted product is found (truthy), it is sent back to the client in 
    // JSON format with a 200 status code
    // else, send a 404 status code and an error message
    if (deletedProduct) {
      res.json(deletedProduct);
    } else {
      res.status(404).json({err: "No product with this ID"})
    }

  } catch (err) {
    // 501 means "Not Implemented", indicating that the server  
    // does not support the functionality required to fulfill the request
    res.status(501).json(err);
  }
});

module.exports = router;
