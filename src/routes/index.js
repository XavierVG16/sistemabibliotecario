// almasenar rutas las rutas
const {Router} = require('express');
const router = Router();
const pool = require('../database');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

//confuracion de ruta inicial
router.get("/",isNotLoggedIn, async (req , res )=>{

    const libros = await pool.query('select *  from libros inner join estado on libros.prestados_libro = estado.idestado ');

    res.render('index',{libros});

});
router.post("/buscar",async (req , res )=>{

    const {isbn_libro , autor_libro , publicacion_libro , titulo_libro} = req.body;

    if (isbn_libro !=""){
        const libros = await pool.query('select *  from libros inner join estado on libros.prestados_libro = estado.idestado  where isbn_libro = ?',[isbn_libro]);
        
        if(libros.length > 0){
            console.log(libros);
            res.redirect('/',[libros]);
        }else {
            res.redirect('/');
        }

    }
    const n ={isbn_libro , autor_libro , publicacion_libro, titulo_libro};
    console.log(n); 


    res.send('recivido')

});



module.exports = router;