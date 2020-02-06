const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('./helper');

passport.use('local.login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'pass_usuario',
  passReqToCallback: true
}, async (req, email, pass_usuario, done) => {
  const rows = await pool.query('SELECT * FROM usuarios  WHERE email = ?', [email]);
  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await helpers.matchPassword(pass_usuario, user.pass_usuario)
    if (validPassword) {
      done(null, user, req.flash('success', 'Bienvenido ' + user.nombres));
    } else {
      done(null, false, req.flash('message', 'Contraseña incorrecta.'));
    }
  } else {
    return done(null, false, req.flash('message', 'El usuario no exixte .'));
  }
}));
 

passport.serializeUser((user, done) => {
  done(null, user.id_usuario);
});

passport.deserializeUser(async (id_usuario, done) => {
  const rows = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id_usuario]);
  done(null, rows[0]);
});


//passsport.serializeUser((us))
