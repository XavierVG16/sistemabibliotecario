const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');
router.get('/', isLoggedIn, async (req, res)=>{

    const libros = await pool.query('select    count(*) as total from libros ');
    const usuarios = await pool.query('select    count(*) as total from usuarios ');
    const lectores = await pool.query('select    count(*) as total from lectores '); 
    const prestamo = await pool.query('select    count(*) as total from prestamos where estado_prestamo = 1 ');
    
    const totallibros = await pool.query('SELECT  id_libro, titulo_libro, autor_libro ,COUNT(*) as total  FROM prestamos   inner join libros on prestamos.id_libro = libros.id_libros GROUP BY id_libro ;');
    const totallector = await pool.query('SELECT  id_lector, nombres, apellidos ,COUNT(*) as total  FROM prestamos   inner join lectores on prestamos.id_lector = lectores.id_lectores GROUP BY id_lector ;');
   
  

    res.render('principal', {libros, usuarios,  prestamo,lectores, totallibros, totallector } );
 });
module.exports = router;