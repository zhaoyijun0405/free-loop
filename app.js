var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var proRouter = require('./routes/pro');
var userRouter = require('./routes/user');
var orderRouter = require('./routes/order');
var cartRouter = require('./routes/cart');
var login1Router = require('./routes/login1');
var register1Router = require('./routes/register1');
const session = require('express-session');
const cookieParser = require('cookie-parser');
var app = express();
// view engine setup

app.use(
  session({
    //加密信息
    secret:'zshyn',
    //强制保存 官方建议false
    resave:false,
    //初始化session 存储 true
    saveUninitialized:true,
    //设置过期时间
    cookie:{
      maxAge:1000*10*60
    }
  })
);

app.use(cookieParser());
//cookie路由守卫
// app.all('*',(req,res,next)=>{
//   console.log('进入全局路由守卫');
//   console.log(req.cookies);
//    // 第一个选项 如果我给你了islogin = ok cookie 你可以直接跳
//    //第一步 是针对合法用户的   第二三部分 是针对 非法用户的放行条件  让他走正门！！！！
//    // if第一步 req.cookies.islogin === 'ok'是针对于 合法用户  直接放行  req.url === '/login'  
//    //req.url ==='/login/in'是针对友善的非法用户去登录页面 
//    if(req.cookies.islogin === 'ok' || req.url === '/login1' || req.url === '/login1/in'||req.url==='/register1'){
//      console.log('next之前');
//      next();
//    }else{
//      console.log('路由守卫进入else里面');
//      res.redirect('/login1')
//    }
// })
//session 路由守卫
app.all("*", (req, res, next) => {
  console.log("进入全局路由守卫");
  //这一步秘问前端那个秘闻 已经找到  藏在服务器的session是什么了 req.session.islogin = 'ok'
  console.log(req.session);
  if (
    req.session.islogin === "ok" ||
    req.url === "/login1" ||
    req.url === "/login1/in"||
    req.url === '/register1' ||
    req.url === '/register1/in' 
  ) {
    console.log("next之前");
    next();
  } else {
    console.log("守卫路由else");
     res.redirect("/login1");
  }
});

 
app.set('views', path.join(__dirname, 'views'));
console.log(path.join(__dirname))
//使用模板 引擎ejs
app.set('view engine', 'ejs');
// dev的时候会处理logger日志
app.use(logger('dev'));
// 使用express的json模块 可以接收和处理现在最常用方便的JSON数据 脚手架已经配好
app.use(express.json());
//xtended: false：表示使用系统模块querystring来处理，也是官方推荐的  
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
//以下是路由表的use  必须先命中第一个路由表  才能进入后面的indexRouter 等 注意！
app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/pro', proRouter);
app.use('/order', orderRouter);
app.use('/user', userRouter);
app.use('/cart', cartRouter);
app.use("/register1", register1Router);
app.use("/login1", login1Router);



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
