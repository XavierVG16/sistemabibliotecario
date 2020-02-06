  
const express = require('express');
const morgan = require('morgan');
const path = require('path'); 
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const passport =require('passport')

const MysQlStore=require('express-mysql-session');

const { database } = require('./keys');


//inicializar express
const app = express();
require('./lib/passport');
//configuraciones o settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views')); // el metodo join concatenar  directorios
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebar')
  }));
  app.set('view engine', '.hbs');

//Widelmares 
app.use(session({

  secret:'xavier',
  resave:false,
  saveUninitialized: false,
  store:  new MysQlStore(database)


}));

app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false})); // aceptar el tipo de formato
app.use(express.json()); // enviar y recivir json
app.use(passport.initialize());// paspot se inicilaliza 
app.use(passport.session()); //inicia secion
// variable global

//toma la informacion del ussurao lo que quiere responder y siguente
app.use((req, res, next) => {
  app.locals.message= req.flash('message');
  app.locals.success= req.flash('success');
  app.locals.user = req.user;
  next();
});

 
//ruta
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/usuarios',require('./routes/usuarios'));
app.use('/carreras',require('./routes/carreras'));
app.use('/lectores',require('./routes/lectores'));
app.use('/libros',require('./routes/libros'));
app.use('/principal',require('./routes/principal'));
app.use('/prestamos',require('./routes/prestamos'));

//public

app.use(express.static(path.join(__dirname,'public')));


//iniciar servidor
app.listen(app.get('port'), ()=>{

    console.log('server on port',app.get('port'))
});