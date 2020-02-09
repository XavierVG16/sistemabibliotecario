const {Router} = require('express');
const router = Router();
const passport = require('passport');
const { isLoggedIn ,isNotLoggedIn } = require('../lib/auth');

router.get('/login',isNotLoggedIn, (req, res) => {
    res.render('login');
  });
  router.post('/login', (req, res, next) => {
   
  const consulta =req.body;
  console.log(consulta);
    passport.authenticate('local.login', {
      successRedirect: '/principal',
      failureRedirect: '/login',
      failureFlash: true
    })(req, res, next);
  });

 router.get('/cerrar', (req , res )=>{
  req.logOut();
   res.redirect('/');

 })


module.exports = router;






















