// almasenar rutas las rutas
const {Router} = require('express');
const router = Router();
const pool = require('../database');
const {  isNotLoggedIn } = require('../lib/auth');

//confuracion de ruta inicial
router.get("/",isNotLoggedIn, async (req , res )=>{

    const libros = await pool.query('select *  from libros inner join estado on libros.prestados_libro = estado.idestado ');

    res.render('index',{libros});

});



module.exports = router;