$(document).ready(function() {
  $.ajax({
   url: BASE_URL + 'tipo_estacion/listar',
   type: "GET",
   async: false,
   success: function(data) {
   		var tipo_estaciones = JSON.parse(data);
   		var rpta =  '<thead><tr><th class="oculto">id</th><th>Nombre</th><th>Operaciones</th></tr></thead>';
   		rpta = rpta + '<tbody>';
   		for (var i = 0; i < tipo_estaciones.length; i++) {
		  	rpta = rpta + '<tr>';
		  	var operaciones = '<td><i class="fa fa-pencil" aria-hidden="true" operacion="editarTipoEstacion"></i><i class="fa fa-times" aria-hidden="true" operacion="eliminarTipoEstacion"></i></td>';
		  	rpta = rpta +
          '<td class="oculto">' + tipo_estaciones[i]['id'] + '</td>' +
          '<td>' + '<input type="text" value="'+ tipo_estaciones[i]['nombre'] + '">' +'</td>' + operaciones + '</tr>';
  		}
  		rpta = rpta + '</tbody>';
  		rpta = rpta + '<tfoot><tr><td  colspan="3"><button class="btn btn-primary" id="btnAgregarEstacion"><i class="fa fa-plus" aria-hidden="true"></i>Agregar Tipo  de Estacion</button></tr></td></tfoot>';
   		$('#tablaTipoEstaciones').append(rpta);
    }
  });
});

$(document).on('click', '#btnAgregarEstacion', function(event) {
	var id_boton = $(event.currentTarget).attr('id');
  var fila = '<tr><td class="oculto">E</td><td><input type="text"></td><td><i class="fa fa-plus" aria-hidden="true" operacion="crearTipoEstacion"></i><i class="fa fa-times" aria-hidden="true" operacion="eliminarTipoEstacion"></i></td></tr>';
  $('#tablaTipoEstaciones tbody').append(fila);
});

$(document).on('click', '.fa', function(event) {
  var operacion = $(event.currentTarget).attr('operacion');
  switch(operacion) {
    case 'crearTipoEstacion':
      var estacion = new Object();
      estacion.nombre = $(event.currentTarget).parent().parent().children().eq(1).children().val();
      var fila = $(event.currentTarget).parent().parent();
      crearTipoEstacion(estacion, fila);
      break;
    case 'editarTipoEstacion':
      var estacion = new Object();
      estacion.id = $(event.currentTarget).parent().parent().children().eq(0).html();
      estacion.nombre = $(event.currentTarget).parent().parent().children().eq(1).children().val();
      editarTipoEstacion(estacion);
      break;
    case 'eliminarTipoEstacion':
      var estacionId = $(event.currentTarget).parent().parent().children().eq(0).html();
      var fila = $(event.currentTarget).parent().parent();
      eliminarTipoEstacion(estacionId, fila);
    break;
  default:
    alert('Operacion ' + operacion + ' no implementada');
  }
});

function eliminarTipoEstacion(estacionId, fila){
  if (estacionId == 'E'){
    fila.remove();
  }else{
    var estacion = new Object();
    estacion.id = estacionId;
    $.ajax({
      url: BASE_URL + 'tipo_estacion/eliminar',
      type: "POST",
      async: false,
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data : JSON.stringify(estacion),
      success: function(data) {
        var rpta = data;
        $('#mensaje').html(rpta['mensaje']);
        if(rpta['tipo_mensaje']=='error'){
          $('#mensaje').removeClass('success');
          $('#mensaje').addClass('error');
        }else{
          $('#mensaje').removeClass('error');
          $('#mensaje').addClass('success');
        }
        fila.remove();
      }
    });
  }
}

function editarTipoEstacion(estacion){
  $.ajax({
    url: BASE_URL + 'tipo_estacion/editar',
    type: "POST",
    async: false,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    data : JSON.stringify(estacion),
    success: function(data) {
      var rpta = data;
      $('#mensaje').html(rpta['mensaje'][0]);
      if(rpta['tipo_mensaje']=='error'){
        $('#mensaje').removeClass('success');
        $('#mensaje').addClass('error');
      }else{
        $('#mensaje').removeClass('error');
        $('#mensaje').addClass('success');
      }
    }
  });
}


function crearTipoEstacion(estacion, fila){
  $.ajax({
    url: BASE_URL + 'tipo_estacion/crear',
    type: "POST",
    async: false,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    data : JSON.stringify(estacion),
    success: function(data) {
      var rpta = data;
      fila.children().eq(0).html(rpta['mensaje'][1]);
      fila.children().eq(2).empty();
      fila.children().eq(2).append('<i class="fa fa-pencil" aria-hidden="true" operacion="editarTipoEstacion"></i><i class="fa fa-times" aria-hidden="true" operacion="eliminarTipoEstacion"></i>');
      $('#mensaje').html(rpta['mensaje'][0]);
      if(rpta['tipo_mensaje']=='error'){
        $('#mensaje').removeClass('success');
        $('#mensaje').addClass('error');
      }else{
        $('#mensaje').removeClass('error');
        $('#mensaje').addClass('success');
      }
    }
  });
}
