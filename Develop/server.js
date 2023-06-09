const express = require('express');
const routes = require('./routes');
// import sequelize connection
const sequelize = require('./config/connection')

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// turn on routes
app.use(routes);

// sync sequelize models to the database, then turn on the server
  //sequelize.sync() = synchronize the models with the database before 
  //starting the server, so that the database is ready and up to date before any requests are made
sequelize.sync({force: false})
  .then(() => {app.listen(PORT, () => 
    console.log(`App listening on port ${PORT}!`));
});

