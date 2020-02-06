// almasenar rutas las rutas
const {Router} = require('express');
const router = Router();
const pool = require('../database');

const { isLoggedIn } = require('../lib/auth');

router.get('/add',isLoggedIn, async (req, res) =>{
    const carrera = await pool.query('select * from carreras ');
    // console.log(usuarios);
      res.render('libros/add',{carrera});
  });
  router.post('/add', async function (req, res) {
    
    const{ codigo_libro, isbn_libro,titulo_libro, stock_libro, autor_libro, editorial_libro,ediccion_libro, publicacion_libro,  idioma_libro,ejemplares_libro,facultad} = req.body;
    
    const fac = await pool.query('select * from carreras where nombre = ?',facultad);
    fac.forEach(element => {
      id_facultad = element.id;
    });


    const newLibro={ codigo_libro, isbn_libro,titulo_libro, stock_libro, autor_libro, editorial_libro,ediccion_libro, publicacion_libro,  idioma_libro,ejemplares_libro,id_facultad};
      console.log(newLibro)

    await pool.query ('INSERT INTO libros  set ?',[newLibro]);
    req.flash('message', 'Libro Guardado Correctamente' );
   res.redirect('/libros');
    //res.send('recivido');
});
router.get('/',isLoggedIn, async (req, res)=>{
    

  const libros = await pool.query('select * from libros ');
 // console.log(usuarios);

  res.render('libros/list',{ libros });
});
router.get('/delete/:id',isLoggedIn, async(req, res)=>{
  
  const { id} = req.params;
  //console.log(id);
   await pool.query('DELETE FROM  libros WHERE id_libros = ?', [id]);
//res.send('recibido');
req.flash('message', 'Libro Eliminado Correctamente' );
   res.redirect('/libros');
});

router.get('/edit/:id', isLoggedIn, async(req, res)=>{
  // console.log(req.params.id);
  const { id} = req.params;
  const libro = await pool.query('SELECT * , carreras.nombre as tipo FROM libros inner join carreras on libros.id_facultad = carreras.id  WHERE id_libros = ?', [id]);
  const carrera = await pool.query('SELECT * from carreras');
//  console.log(id);
  res.render('libros/edit', {carrera,libro: libro[0]});
// res.send('recivido');
});

router.post('/edit/:id', async (req, res)=>{
  const { id} = req.params;
  
  const{ codigo_libro, isbn_libro,titulo_libro, stock_libro, autor_libro, editorial_libro,ediccion_libro, publicacion_libro,  idioma_libro,ejemplares_libro,facultad} = req.body;

  const fac = await pool.query('select * from carreras where nombre = ?',facultad);
  fac.forEach(element => {
    id_facultad = element.id;
  });
    const edLibro={ codigo_libro, isbn_libro,titulo_libro, stock_libro, autor_libro, editorial_libro,ediccion_libro, publicacion_libro,  idioma_libro,ejemplares_libro,id_facultad};
      console.log(edLibro)
 console.log(id);
 // console.log(edUsuario);
  await pool.query('UPDATE libros set ? WHERE id_libros = ?', [edLibro, id]);
  req.flash('message', 'Libro Actualizado Correctamente' );
  res.redirect('/libros');
 //res.send('recivido');
})


module.exports = router;