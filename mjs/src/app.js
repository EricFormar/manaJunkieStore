var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

/* RUTAS CONST */

var indexRouter = require('./routes/indexRoute');

const usersRouter = require('./routes/usersRoute');
const productsRouter= require('./routes/productsRoute');

const carritoRouter = require('./routes/carritoRoute');
const allProductsRouter = require('./routes/allProductsRoute');

// const loginRouter = require('./routes/loginRoute');
// const registerRouter = require('./routes/registerRoute');

// const productDetailRouter = require('./routes/producDetailRoute');
// const productAddRouter = require('./routes/productAddRoute');
// const productEditRouter = require('./routes/productEditRoute');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

/* RUTAS USE */

app.use('/', indexRouter);

app.use('/users', usersRouter);
app.use('/products', productsRouter)

app.use('/carrito',carritoRouter)
// app.use('/store', allProductsRouter)

// app.use('/login', loginRouter)
// app.use('/register', registerRouter)
// **********************
// app.use('/productDetail', productDetailRouter)
// app.use('/productAdd', productAddRouter)
// app.use('/productEdit', productEditRouter)
// **********************

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

let puerto = "http://localhost:3000/"
console.log(`Página corriendo en: ${puerto}`);


module.exports = app;