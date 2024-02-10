const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');

const app = express();

// Configuración de sesiones
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));


//settings
app.set('port',process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));

app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));

//routes
app.use(require('./routes/index.js'));

//static filse
app.use(express.static(path.join(__dirname, 'public')));

//routes

module.exports = app;