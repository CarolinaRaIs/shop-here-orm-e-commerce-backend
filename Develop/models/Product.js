// import important parts of sequelize library
const { Model, DataTypes } = require('sequelize');
const { validate } = require('../config/connection');
// import our database connection from config.js
const sequelize = require('../config/connection');

// Initialize Product model (table) by extending off Sequelize's Model class
class Product extends Model {}

// set up fields and rules for Product model
Product.init(
  {
    // define columns
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },

    product_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    
    price: {
      // DECIMAL(10,2) =  the maximum number of digits allowed is 10, with 2 digits reserved for the decimal part of the number
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      // isDecimal = (Sequalize validator) checks that the value is a decimal number
      validate: {
        isDecimal: true
      }
    },

    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // set a default of 10
      defaultValue: 10,
      // isNumeric = (Sequalize validator) checks that the value is numeric.
      validate: {
        isNumeric: true
      }
    },

    category_id: {
      type: DataTypes.INTEGER,
      // category_id references the category model's id (references the id column in the category table)
      // will be referenced in index.js with belongTo = create a foreign key (category_id) reference in Product model to the Category model
      references: {
        model: 'category',
        key: 'id'
      }
    }

  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product',
  }
);

module.exports = Product;
