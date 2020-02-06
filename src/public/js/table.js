$(document).ready( function () {
    $('.AllDataTables').DataTable({ //  atibuto clase= AllDataTable de la tabal
        language: {
            "sProcessing":     "Procesando...",
            "sLengthMenu":     "Mostrar _MENU_ registros",
            "sZeroRecords":    "No se encontraron resultados", // respuesta si no se encontro 
            "sEmptyTable":     "Ningún dato disponible en esta tabla",// la tabal esta bacia
            "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros", // mostrar los registros en orde 
            "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros", //paginacion de las pagians
            "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",// muestra la cantidad de registros totales
            "sInfoPostFix":    "",
            "sSearch":         "Buscar:",//cuadro de busqueda
            "sUrl":            "",
            "sInfoThousands":  ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst":    "Primero", // paginacion 
                "sLast":     "Último",// desde el ultimo
                "sNext":     "Siguiente",// siguente >>
                "sPrevious": "Anterior"// anteriro <<
            },
            "oAria": {
                "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        }
    });
} );