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
      
     const { ci, fechaprestamo, id_usuario}= req.body;
     // obtener el id del del lector
     //--------------------------------------------------------------------------------//
     
     const lector= await pool.query('select * from lectores where  ci = ?',ci);
     if (lector.length > 0){
         
        lector.forEach(element => {
           
                es = element.estado;
            id_lector = element.id_lectores;
            
          
            
      });

    
     } else {
         console.log('no existe');
         req.flash('message','El Lector No Existe')
         res.redirect('/lectores/add');
     }
     //----------------------------------------------------------------------------------
     // obteniendo el id del libro
  /* const libro   = await pool.query('select * from libros where isbn_libro = ?', id);
   libro.forEach(element => {
    id_libro = element.isbn_libro;
   });*/
   

   if (es ==0){
   const estado_prestamo = 1;
     const add ={
         id_libro,
         id_lector,
         fechaprestamo,
         
         estado_prestamo,
         id_usuario
     };
     const  prestados_libro =1;
     const  estado =0;
     const e={ estado}

     const p = { prestados_libro};
   const registrar =await pool.query('insert into prestamos set ?',[add])
  const libros = await pool.query('update libros set ? where id_libros = ?',[p,id_libro]);
  const lectores = await pool.query('update lectores set ? where id_lectores = ?',[e,id_lector]);

     console.log(registrar);
     
    // console.log(d);
    //console.log(ci);
    req.flash('success','Prestamo registrado Correctamente');
    res.redirect('/prestamos/pendientes');
   }else {
    req.flash('message', 'Lector no Disponible' );
    res.redirect('/prestamos');
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