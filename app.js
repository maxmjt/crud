
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');

/*mongoose.connect('mongodb://localhost/usuarios',function(err){
	if(!err){
		console.log('Se conecto satisfactoriamente.');
	}else{
		throw err;
	}
})*/
mongoose.connect('mongodb://localhost/usuarios')
var Schema = mongoose.Schema;
var ObjectId =Schema.ObjectId;

var Tarea = new Schema({
	tarea: String
});

var Tarea = mongoose.model('Tarea', Tarea);

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/tareas', function(req, res){
	Tarea.find({}, function(err, docs){
		console.log(docs);
		res.render('tareas/index.jade', {
			title: 'vista index de lista de tareas',
			docs: docs
		});
	});
});
app.get('/tareas/nueva', function(req, res){
	res.render('tareas/nueva.jade',{
		title: 'Nueva Tarea'
	});
});
app.post('/tareas',function(req, res){
	var tarea = new Tarea(req.body.tarea);
	tarea.save(function(err){
		if(!err){
			res.redirect('/tareas')
		}else{
			res.redirect('/tareas/nueva');
		}
	});
});

app.get('/tareas/:id/editar',function(req,res){
	Tarea.findById(req.params.id,function(err,docs){
		res.render('tareas/editar',{
			title:'Vista Editar Tarea',
			tarea: docs
		});
	});
});

app.put('/tareas/:id',function(req,res){
	Tarea.findById(req.params.id, function(err, docs){
		docs.tarea = req.body.tarea.tarea;
		docs.save(function(err){
			if(!err){
				res.redirect('/tareas');
			}else{
				//manejo errores
			}
		});
	});
});

app.del('/tareas/:id',function(req,res){
	Tarea.findById(req.params.id, function(err,docs){
		if(!docs) return next(new NotFound('Documento no se encuentra'));
		docs.remove(function(){
			res.redirect('/tareas')
		});
	});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
