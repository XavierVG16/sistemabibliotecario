const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', isLoggedIn,async (req, res) =>{
const tipolector = await pool.query('select * from tipolector ');
    // console.log(usuarios);
   
    res.render('lectores/add',{ tipolector });
});

router.post('/add', isLoggedIn,async (req, res)  =>{
 
  
    const{ nombres, apellidos, ci, telefono, direccion,tipolector
    } = req.body;

    const lector_id = await pool.query('select * from tipolector where nombre=?',tipolector)
    lector_id.forEach(element => {
      id_tipolector= element.id;
    });
  
   
   
    console.log(id_tipolector);
    const newLector={
      nombres, 
      apellidos, 
      ci, 
      telefono, 
      direccion,
      id_tipolector
  };
  /* const t = await pool.query("SELECT id FROM tipolector ",function(err, rows, file){
    rows.forEach(function(row) {
       tipo =row.id;
     // console.log(tipo);

    });
   
   });
    */
    

  await pool.query ('INSERT INTO lectores  set ?',[newLector]);
   req.flash('message', 'Lector Guardado Correctamente' );
  res.redirect('/lectores');
 
});

// tabla de lectores
router.get('/',isLoggedIn, async (req, res)=>{
    

    const lectores = await pool.query('select * , tipolector.nombre as tipo from lectores inner join tipolector on lectores.id_tipolector=tipolector.id');
   // console.log(usuarios);
  
    res.render('lectores/list',{ lectores });
 });
 router.get('/delete/:id', async(req, res)=>{
    // console.log(req.params.id);
    const { id} = req.params;
     await pool.query('DELETE FROM  lectores WHERE id_lectores = ?', [id]);
     req.flash('message', 'Lector eliminado Correctamente' );
     res.redirect('/lectores');
     
 });

 router.get('/edit/:id', isLoggedIn,async(req, res)=>{
    // console.log(req.params.id);
    const { id} = req.params;
    const lector = await pool.query('SELECT *, tipolector.nombre as tipo FROM lectores inner join tipolector on lectores.id_tipolector= tipolector.id  WHERE id_lectores = ?', [id]);
    const tipo = await pool.query('SELECT * from tipolector');
    res.render('lectores/edit',  {tipo,lector: lector[0]});
  // res.send('recivido');
 });
 router.post('/edit/:id', isLoggedIn,async (req, res)=>{
  
    const { id} = req.params;
    const{ nombres, apellidos, ci, telefono, direccion,tipolector} = req.body;
    const lector_id = await pool.query('select * from tipolector where nombre=?',tipolector)
    lector_id.forEach(element => {
      id_tipolector= element.id;
    });
  
   
    const edLector={ 
        nombres, 
        apellidos, 
        ci, 
        telefono, 
        direccion,
        id_tipolector
    };
   console.log(id);
   console.log(id_tipolector);
   // console.log(edUsuario);
   await pool.query('UPDATE lectores set ? WHERE id_lectores = ?', [edLector, id]);
   req.flash('message', 'Lector Actualizado Correctamente' );
   res.redirect('/lectores');
  // res.send('recivido');
})

module.exports = router;
