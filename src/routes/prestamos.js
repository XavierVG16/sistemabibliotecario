const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

 

router.get('/add', (req, res)=>{
 
    res.render('prestamos/add');

});




//////////////////////////////// lista prestamos

router.get('/',isLoggedIn, async (req, res)=>{

    const libros = await pool.query('select *  from libros inner join estado on libros.prestados_libro = estado.idestado  ');
    // console.log(usuarios);
  
   
     res.render('prestamos/list',  { libros });
 });

 router.get('/add/:id_libro', isLoggedIn,async (req, res)=>{
    const { id_libro} = req.params;
    
     
    const libro = await pool.query('SELECT * FROM libros  WHERE id_libros = ?', [id_libro]);
   
    res.render('prestamos/add',{libro: libro[0]});

 }),
 router.post('/add/:id_libro', async (req, res)=>{
    const  { id_libro} = req.params;
      
     const  { ci, fechaprestamo, id_usuario}= req.body;
     
 ////////////////////////////////////////////////////////////obtener lector;
 const lector = await pool.query('select * from lectores where ci = ?',ci);
 

    
    if (lector.length > 0){
        console.log(lector)
        lector.forEach(element => {
            id_lector = element.id_lectores;
            estadolector = element.estado
       
        });
        console.log(id_lector)
        console.log(estadolector);
       const libros= await pool.query('select * from libros where id_libros = ?',id_libro);
       
       libros.forEach(element => {
           prestados_libros = element.prestados_libro;
       });
       if (prestados_libros==0){

        if (estadolector==0){
            estado_prestamo=1
        const prestamoadd = {
            id_libro ,
            id_lector,
            fechaprestamo,
            estado_prestamo,
            id_usuario

        }
        const add = await pool.query('insert into prestamos set ?',[prestamoadd]);
        const prestados_libro = 1;
        const libroupdate ={prestados_libro};

        const libroadd = await pool.query('update libros set ? Where id_libros = ?',[libroupdate, id_libro]);

        const estado =1;
        const estado_lector ={estado}

        const lectorupdate =await pool.query('update lectores  set ? where id_lectores =?',[estado_lector, id_lector]);
            req.flash('success', 'Prestamo Realizado' );
            res.redirect('/prestamos/pendientes');

        }else{
            req.flash('message', 'Lector con pendientes' );
            res.redirect('/prestamos');
        }


       }
       else{
        req.flash('message', 'Libro no dispopnible' );
        res.redirect('/prestamos');
       }
    
}else {
    req.flash('message', 'Lector no regisstrado' );
    res.redirect('/lectores');
}



 })
///////////////////////////////////////////////////

router.get('/pendientes',isLoggedIn, async (req, res)=>{
   const prestamos=  await pool.query('select id, estado_prestamo, lectores.nombres as nombres , lectores.apellidos as apellidos, fechaprestamo  , libros.titulo_libro as titulo from prestamos inner join lectores on prestamos.id_lector = lectores.id_lectores inner join libros on prestamos.id_libro = libros.id_libros where estado_prestamo=1');
  
  
 
    res.render('prestamos/pendin',{prestamos});
});

router.get('/edit/:id',isLoggedIn, async(req , res )=>{
    const { id} = req.params;


    //const lectotr = await
    console.log(id);
    var hoy = new Date();
var dd = hoy.getDate();
var mm = hoy.getMonth()+1;
var yyyy = hoy.getFullYear();
const fechadevolucion = yyyy+'-'+mm+"-"+dd;


/*---------------------------------------------------Obtener el lector-------------------------------------------------*/

const lectores = await pool.query('select * from prestamos Where id = ?',id);
lectores.forEach(element => {
    id_lector = element.id_lectore;
    id_libro = element.id_libro;
});
const estado = 0;
const estadoEdit = {estado}
const lector = await pool.query('update lectores  set ? where id_lectores =?',[estadoEdit, id_lector]);
console.log(id_lector);
/*--------------------------------------------------- estado libro -----------------------------------------------*/
const prestados_libro = 0;
const prestados = {prestados_libro}
 const libro = await pool.query('update libros set ? Where id_libros = ?',[prestados, id_libro]);

  // console.log(t);
  ////////////////////////////////entregar libro

  const estado_prestamo = 0;
  const entregado = {fechadevolucion,estado_prestamo}
 const prestamo =   await pool.query('Update prestamos set  ? Where id = ? ',[entregado, id]);
console.log(prestamo);

     req.flash('success', 'Libro entregado Correctamente' );
    res.redirect('/prestamos/pendientes');
});
router.get('/', async (req, res)=>{

    const libros = await pool.query('select * from libros ');
    // console.log(usuarios);
  
   
     res.render('prestamos/list',  { libros });
 });

 router.get('/todo', async (req , res )=>{
       const todo = await pool.query('select id, estado_prestamo, lectores.nombres as nombres , lectores.apellidos as apellidos, fechaprestamo , fechadevolucion , libros.titulo_libro as titulo  , estadoprestamo.nombre as estado from prestamos inner join lectores on prestamos.id_lector = lectores.id_lectores inner join libros on prestamos.id_libro = libros.id_libros inner join estadoprestamo on prestamos.estado_prestamo = estadoprestamo.id_estado');

   // res.send('recivido')
res.render('prestamos/all',{todo})

 });


  

module.exports = router;