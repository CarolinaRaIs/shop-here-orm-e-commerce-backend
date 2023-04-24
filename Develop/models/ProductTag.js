const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');
const Product = require('./Product');

class ProductTag extends Model {}

ProductTag.init(
  {
    // define columns
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },

    product_id: {
      type: DataTypes.INTEGER,
      // product_id references the product model's id (references the id column in the product table)
      // belongTo = create a foreign key reference in Product model to the Category model
      references: {
        model: 'product',
        key: 'id'
      }
    },

    tag_id: {
      type: DataTypes.INTEGER,
      // references the tag model's id
      references: {
        model: 'tag',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product_tag',
  }
);

//Define the association between the ProductTag and Product models
ProductTag.belongsTo(Product, { foreignKey: 'product_id'});
//Define the association between the ProductTag and Tag models
ProductTag.belongsTo(Tag, { foreignKey: 'tag_id'});

module.exports = ProductTag;
