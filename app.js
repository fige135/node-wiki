/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
// var user = require('./routes/user');
var http = require('http');
var path = require('path');
//mongodb
// var MongoStore = require('connect-mongo');
var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');
var flash = require('connect-flash');
var partials = require('express-partials');

var app = express();



// all environments
app.set('port', process.env.PORT || 3000);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
//设置程序的图标为express的图标，并将工作日志打印到后台显示。
app.use(express.favicon());
app.use(express.logger('dev'));
//bodyParser()是Connect的内建middleware，这样可以将用户提交过来的数据放到request.body中。
app.use(express.bodyParser());
//methodOverride()也是Connect的内建middleware，可以协助post处理和伪装其他http method，如put和delete。
app.use(express.methodOverride());

//flash before session
 app.use(flash());
//session
app.use(express.cookieParser());
app.use(express.session({
	secret: settings.cookieSecret,
	store: new MongoStore({
		db: settings.db
	})
}));

//static()同样是Connect的内建middleware，是用来协助静态的request请求的，
//如css、js和img等静态文件，所以在static里面的，会全部作为静态形式返回给用户。
app.use(express.static(path.join(__dirname, 'public')));


//errorHandler()一样是Connect的内建middleware，用来处理异常的，这个一般在开发过程中会用到，上线以后将其去掉。
// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

//视图助手
/*app.dynamicHelpers({
  user: function(req, res) {
    return req.session.user;
  },
  error: function(req, res) {
    var err = req.flash('error');
    if (err.length)
      return err;
    else
      return null;
  },
  success: function(req, res) {
    var succ = req.flash('success');
    if (succ.length)
      return succ;
    else
      return null;
  },
});*/

/*app.use(function(req,res,next){
      res.locals.user=req.session.user;
      res.locals.error=req.flash('error').length?req.flash('error'):null;
      res.locals.success=req.flash('success').length?req.flash('success'):null;
        next();
    });

//路由
routes(app);*/

app.use(function(req, res, next) {
res.locals.error = req.flash('error').toString();
res.locals.success = req.flash('success').toString();
res.locals.user = req.session ? req.session.user : null;
next();
});

//router在express官方说这句是可有可无的，删掉以后还真可以正常运行，不过还是写上吧。
app.use(app.router);
routes(app);


http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});