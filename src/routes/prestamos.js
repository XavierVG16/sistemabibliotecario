const express = require('express');
const router = express.Router();
const pdfMake = require('../pdfmake/pdfmake');
const vfsFonts = require('../pdfmake/vfs_fonts');
const random = require ( 'random') ;
pdfMake.vfs = vfsFonts.pdfMake.vfs;
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

 

router.get('/add', (req, res)=>{
 
    res.render('prestamos/add');

});




//////////////////////////////// lista prestamos

router.get('/',isLoggedIn, async (req, res)=>{

    const libros = await pool.query('select *  from libros inner join estado on libros.prestados_libro = estado.idestado inner join carreras on  libros.id_facultad = carreras.id  ');
    // console.log(usuarios);
   
   //pruebas mostrar catidad de libros 

   libros.forEach(element => {
       ejemplares = element.ejemplares_libro;
       if(ejemplares > 0){
           estado = "Disponible "+ejemplares;
       } else if (ejemplares == 0){
           estado ="Prestado";
       }
       const ejemplar ={ estado };
       console.log(estado , ejemplar);
   });

   

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
          const fechadevolucion= "";
        if (estadolector==0){
            estado_prestamo=1
        const prestamoadd = {
            id_libro ,
            id_lector,
            fechaprestamo,
            fechadevolucion,
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
            req.flash('message', 'Lector con prestamos  pendientes' );
            res.redirect('/prestamos/pendientes');
        }


       }
       else{
        req.flash('message', 'Libro no dispopnible' );
        res.redirect('/prestamos');
       }
    
}else {
    req.flash('message', 'Lector no registrado' );
    res.redirect('/lectores/add');
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
    id_lector = element.id_lector;
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

     req.flash('success', 'Libro Devuelto Correctamente' );
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

 router.get('/pdf', async (req , res )=>{
    res.render('prestamos/pdf')




});
router.post('/pdf/print', async (req , res )=>{
    const { fechaprestamo, usuario} = req.body;
    
    console.log(usuario)

  const fecha= req.body.fechaprestamo;
  var arr =[];
  var f = new Array();
  f.push('Nombres' )
  f.push('Libro')   
  f.push('Fecha prestamo' )  
  f.push('Fecha devolucion' )  
  f.push('Estado')  
  arr.push(f)


    var array = await pool.query('select id, estado_prestamo, lectores.nombres as nombres , lectores.apellidos as apellidos, fechaprestamo , fechadevolucion , libros.titulo_libro as titulo  , estadoprestamo.nombre as estado from prestamos inner join lectores on prestamos.id_lector = lectores.id_lectores inner join libros on prestamos.id_libro = libros.id_libros inner join estadoprestamo on prestamos.estado_prestamo = estadoprestamo.id_estado  where fechaprestamo =?',[fechaprestamo]);
    
    var fechaid =[]
    array.forEach(element =>{
        f = element.fechaprestamo
        fechaid.push(element.fechaprestamo);
    
        
    })
    console.log(fechaid)
    var indice = fechaid.indexOf(fecha);
    if(indice !== -1){
        array.forEach(element =>{

        
            var fila = new Array();
            fila.push(element.nombres+ ' '+element.apellidos )
            fila.push(element.titulo )   
            fila.push(element.fechaprestamo )  
            fila.push(element.fechadevolucion )  
            fila.push(element.estado)  
             
       
            arr.push(fila)
        
       
           
        })
       //console.log(arr)
       // const pa= [ array.RowDataPacket]
       var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth()+1;
    var yyyy = hoy.getFullYear();
    
    var hoy = yyyy+'/'+ mm +'/'+ dd ;
    
    
       var reporte = 0;
       var r = random.int(min = 1, max = 1000)
      
       if(r.length = 1 ){
           reporte = 'ISTV000'+r;
        
    
       } else if(r.length = 2){
        reporte = 'ISTV00'+r;
      
    
       }else  if(r.length = 3){
        reporte = 'ISTV0'+r;
      
       }else if(r.length = 4){
        reporte = 'ISTV'+r;
       }
       console.log(reporte);
    
        var documentDefinition ={
    
    
             content: [
                 // Header
                 {
                     columns: [
                         {
                             image: 'data:img/png;base64,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',
                             
                         },
                             
                         [
                             {
                                 text: 'Instito Superior Tecnologico Vicente Leon', 
                                 style: 'invoiceTitle',
                                 width: '*'
                             }, 
                             {
                               stack: [
                                    {
                                        columns: [
                                             {
                                                 text:'Reporte  # ', 
                                                 style:'invoiceSubTitle',
                                                 width: '*'
                                                 
                                             }, 
                                             {
                                                 text: `${reporte}`,
                                                 style:'invoiceSubValue',
                                                 width: 100
                                                 
                                             }
                                             ]
                                    },
                                    {
                                        columns: [
                                            {
                                                text:'Reportes del',
                                                style:'invoiceSubTitle',
                                                width: '*'
                                            }, 
                                            {
                                                text:`${fecha} `,
                                                style:'invoiceSubValue',
                                                width: 100
                                            }
                                            ]
                                    },
                                    {
                                        columns: [
                                            {
                                                text:'Fecha actual',
                                                style:'invoiceSubTitle',
                                                width: '*'
                                            }, 
                                            {
                                                text:`${hoy} `,
                                                style:'invoiceSubValue',
                                                width: 100
                                            }
                                            ]
                                    },
                                ]
                             }
                         ],
                     ],
                     
                 },
                 // Billing Headers
                
                 // Billing Details
                 
                
                 // Line breaks
                 '\n\n',
                 // Items
                 {
                   table: {
                     // headers are automatically repeated if the table spans over multiple pages
                     // you can declare how many rows should be treated as headers
                     headerRows: 1,
                   
             
                     body:arr
                      
                     
                   }, // table
                
                 },
         
                
                 {
                    columns: [
                        {
                            text:'',
                        },
                        {
                            stack: [
                                { 
                                    text: '_________________________________',
                                    style:'signaturePlaceholder'
                                },
                                { 
                                    text: 'Administrador',
                                    style:'signatureName'
                                    
                                },
                                { 
                                    text: `${usuario}`,
                                    style:'signatureJobTitle'
                                    
                                }
                                ],
                           width: 180
                        },
                    ]
                }
                
             ],
             styles: {
                 // Document Header
                 documentHeaderLeft: {
                     fontSize: 10,
                     margin: [5,5,5,5],
                     alignment:'left'
                 },
                 documentHeaderCenter: {
                     fontSize: 10,
                     margin: [5,5,5,5],
                     alignment:'center'
                 },
                 documentHeaderRight: {
                     fontSize: 10,
                     margin: [5,5,5,5],
                     alignment:'right'
                 },
                 // Document Footer
                 documentFooterLeft: {
                     fontSize: 10,
                     margin: [5,5,5,5],
                     alignment:'left'
                 },
                 documentFooterCenter: {
                     fontSize: 10,
                     margin: [5,5,5,5],
                     alignment:'center'
                 },
                 documentFooterRight: {
                     fontSize: 10,
                     margin: [5,5,5,5],
                     alignment:'right'
                 },
                 // Invoice Title
                 invoiceTitle: {
                     fontSize: 22,
                     bold: true,
                     alignment:'right',
                     margin:[0,0,0,15]
                 },
                 // Invoice Details
                 invoiceSubTitle: {
                     fontSize: 12,
                     alignment:'right'
                 },
                 invoiceSubValue: {
                     fontSize: 12,
                     alignment:'right'
                 },
                 // Billing Headers
                 invoiceBillingTitle: {
                     fontSize: 14,
                     bold: true,
                     alignment:'left',
                     margin:[0,20,0,5],
                 },
                 // Billing Details
                 invoiceBillingDetails: {
                     alignment:'left'
         
                 },
                 invoiceBillingAddressTitle: {
                     margin: [0,7,0,3],
                     bold: true
                 },
                 invoiceBillingAddress: {
                     
                 },
                 // Items Header
                 itemsHeader: {
                     margin: [0,5,0,5],
                     bold: true
                 },
                 // Item Title
                 itemTitle: {
                     bold: true,
                 },
                 itemSubTitle: {
                     italics: true,
                     fontSize: 11
                 },
                 itemNumber: {
                     margin: [0,5,0,5],
                     alignment: 'center',
                 },
                 itemTotal: {
                     margin: [0,5,0,5],
                     bold: true,
                     alignment: 'center',
                 },
         
                 // Items Footer (Subtotal, Total, Tax, etc)
                 itemsFooterSubTitle: {
                     margin: [0,5,0,5],
                     bold: true,
                     alignment:'right',
                 },
                 itemsFooterSubValue: {
                     margin: [0,5,0,5],
                     bold: true,
                     alignment:'center',
                 },
                 itemsFooterTotalTitle: {
                     margin: [0,5,0,5],
                     bold: true,
                     alignment:'right',
                 },
                 itemsFooterTotalValue: {
                     margin: [0,5,0,5],
                     bold: true,
                     alignment:'center',
                 },
                 signaturePlaceholder: {
                     margin: [0,70,0,0],   
                 },
                 signatureName: {
                     bold: true,
                     alignment:'center',
                 },
                 signatureJobTitle: {
                     italics: true,
                     fontSize: 10,
                     alignment:'center',
                 },
                 notesTitle: {
                   fontSize: 10,
                   bold: true,  
                   margin: [0,50,0,3],
                 },
                 notesText: {
                   fontSize: 10
                 },
                 center: {
                     alignment:'center',
                 },
             },
             defaultStyle: {
                 columnGap: 20,
             }
         }
    
    
        const pdfDoc = pdfMake.createPdf(documentDefinition);
        pdfDoc.getBase64((data)=>{
            res.writeHead(200, 
            {
                'Content-Type': 'application/pdf',
                'Content-Disposition':'attachment;filename="Reporte_'+reporte+'.pdf"'
            });
    
            const download = Buffer.from(data.toString('utf-8'), 'base64');
            res.end(download);
            
            
        });
    
       
    }else{
      console.log("No encontrado");
      req.flash('message','No Exiten reportes');
      res.redirect('/prestamos/pdf')
    }
 
   


});



  

module.exports = router;