const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint
// In insomnia: GET http://localhost:3002/api/tags
// tags = function set up for route link
router.get('/', async(req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tags = await Tag.findAll({
      include: [
        {
          model:Product,
        }
      ]
    });
    res.json(tags);
    
  } catch (err) {
    res.status(500).json(err);
  }
});

// In insomnia: GET http://localhost:3002/api/tags/:id
router.get('/:id', async(req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    //tagByID = stores a single Tag object 
    //obtained by querying the database for a Tag with the specified id using the findOne() method
    const tagByID = await Tag.findOne({
      where: {
        id: req.params.id
      },

      include: [
        {
          model: Product
        }
      ]
    });

    if (tagByID) {
      res.json(tagByID);
    } else {
      res.status(404).json({err: "No tag with this ID"});
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// In insomnia: POST http://localhost:3002/api/tags
router.post('/', async(req, res) => {
  // create a new tag
  try {
    const newTag = await Tag.create ({
      //Snake-case to name db columns- referenced from Tag.js model
      tag_name: req.body.tag_name
    });
    res.json(newTag);
  } catch (err) {
    res.status(500).json(err);
  }
});

// In insomnia: PUT http://localhost:3002/api/tag/:id
router.put('/:id', async(req, res) => {
  // update a tag's name by its `id` value
  try {
    const updatedTag = await Tag.update(req.body, {
      where: {
        id: req.params.id
      }
    });

    if (updatedTag) {
      res.json(updatedTag);
    } else {
      res.status(404).json({err: "No tag with this ID"});
    } 

  } catch (error) {
    res.status(500).json(err);
  }
});

// In insomnia: DELETE http://localhost:3002/api/tags/:id
router.delete('/:id', async(req, res) => {
  // delete on tag by its `id` value
  try {
    const deletedTag = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });

    if (updatedTag) {
      res.json(deletedTag);
    } else {
      res.status (404).json({err: "No tag with this ID"});
    }
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;
