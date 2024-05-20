const express = require('express');
const path = require('path');
const morgan = require('morgan');
const chalk = require('chalk');
const debug = require('debug')('products-app:server');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set the view engine to EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const productsRouter = require('./routes/products');
app.use('/products', productsRouter);

// Start the server
app.listen(port, () => {
    debug(`Server is running on port ${port}`);
    console.log(chalk.green(`Server is running on port ${port}`));
});
