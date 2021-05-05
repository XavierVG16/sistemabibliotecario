const express = require('express');
const router = express.Router();

const pool = require('../database');
const helpers = require('../lib/helper');
const { isLoggedIn } = require('../lib/auth');

var idtipousuario =0;
//redireccionar 
router.get('/add', async (req, res) =>{
  const tipousuario = await pool.query('select * from tipousuario ');
  // console.log(usuarios);
    res.render('usuarios/add',{tipousuario});
});
// aa uu
router.post('/add', async(req, res)=>{
  const{nombres, apellidos,ci, email,telefono, 	pass_usuario, id_tipousuario} = req.body;

  const usuario_id = await pool.query('select * from tipousuario where denominacion = ?',id_tipousuario);
  usuario_id.forEach(element => {
    idtipousuario = element.id;
  });
 
    const newUsuario={
        nombres, 
        apellidos, 
        ci,
         email, 
         telefono,
         pass_usuario,
         idtipousuario

    };
 // pruebas de validacion datos cedula3 
 const rows = await pool.query('select *  from usuarios where ci = ? ', ci);
 if (rows.length > 0){
  req.flash('message', 'El usuario ya existe' );
  res.redirect('/usuarios/add');
   console.log('usuario encontrado ');

 }else{
  newUsuario.pass_usuario = await helpers.encryptPassword(pass_usuario);
  await pool.query('insert into usuarios set ?',[newUsuario]);
   req.flash('success', 'Usuario agregado correctamente' );
  res.redirect('/usuarios');

   console.log('usuaio no registrado');

 }
    
 
  

 
});
// tabla de ususarios
router.get('/',async (req, res)=>{
    const {id_usuario}= req.user
const id = {id_usuario}
            const usuarios = await pool.query('select *, tipousuario.denominacion as tipo  from usuarios inner join tipousuario on usuarios.idtipousuario = tipousuario.id id_usuario <> ?', id_usuario);
  // console.log(usuarios);
   res.render('usuarios/list',{ usuarios });
});

router.get('/delete/:id', async(req, res)=>{
   // console.log(req.params.id);
   const { id} = req.params;
    await pool.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
  
  req.flash('success', 'Usuario eliminado correctamente' );
    res.redirect('/usuarios');
});
router.get('/edit/:id', isLoggedIn,async(req, res)=>{
    // console.log(req.params.id);
    const { id} = req.params;
    const usuario = await pool.query('select *, tipousuario.denominacion as tipo  from usuarios inner join tipousuario on usuarios.idtipousuario = tipousuario.id  WHERE id_usuario = ?', [id]);
    const tipo_usuario = await pool.query('select * from tipousuario ');
  //  console.log(id);
    res.render('usuarios/edit', {tipo_usuario ,usuario: usuario[0]});
  // res.send('recivido');
 });
router.post('/edit/:id', async (req, res)=>{
  /// editar usiario
  const { id } = req.params;
  const{nombres, apellidos,ci, email,telefono, 	pass_usuario, id_tipousuario} = req.body;
  const usuario_id = await pool.query('select * from tipousuario where denominacion = ?',id_tipousuario);
  usuario_id.forEach(element => {
    idtipousuario = element.id;
  });
  const edUsuario={
      nombres, 
      apellidos, 
      ci,
       email, 
       telefono,
       pass_usuario,
       idtipousuario

  };
  edUsuario.pass_usuario = await helpers.encryptPassword(pass_usuario);
 console.log(id);
 // console.log(edUsuario);
  await pool.query('UPDATE usuarios set ? WHERE id_usuario = ?', [edUsuario, id]);

    req.flash('success', 'Usuario actualizado correctamente' );
    res.redirect('/usuarios');
});

module.exports = router;
