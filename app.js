var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs');

var app = express();

// 后端模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('.html', ejs.__express);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 后台路由(api)
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var accessRouter = require('./routes/access');
var menuRouter = require('./routes/menu');
var helpRouter = require('./routes/help');

var pagesRouter = require('./routes/pages');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/wx_access', accessRouter);
app.use('/menu', menuRouter);
app.use('/help', helpRouter);

app.use('/pages', pagesRouter); // 这个接口用于处理页面访问的

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

module.exports = app;
