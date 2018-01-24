function helperSelectTipoEstacion(tipo_estaciones, tipo_estacion_id){
  var rpta = "<select>";
  for(var i = 0; i < tipo_estaciones.length; i++){
    if(tipo_estaciones[i]["id"] == tipo_estacion_id){
      rpta = rpta + '<option value="' + tipo_estaciones[i]['id'] + '" selected="selected">' + tipo_estaciones[i]['nombre'] + '</option>';
    }else{
      rpta = rpta + '<option value="' + tipo_estaciones[i]['id'] + '">' + tipo_estaciones[i]['nombre'] + '</option>';
    }
  }
  rpta = rpta + "</select>";
  return rpta;
}

function getTipoEstacion(){
  var rpta = [];
  $.ajax({
   url: BASE_URL + 'tipo_estacion/listar',
   type: "GET",
   async: false,
   success: function(data) {
      rpta = JSON.parse(data);
    }
  });
  return rpta;
}

$(document).ready(function() {
  $.ajax({
   url: BASE_URL + 'estacion/listar',
   type: "GET",
   async: false,
   success: function(data) {
   		var estaciones = JSON.parse(data);
      var tipo_estaciones = getTipoEstacion();
   		var rpta =  '<thead><tr><th class="oculto">id</th><th>Nombre</th><th>Descripción</th><th>Latitud</th><th>Longitud</th><th>Altura</th><th>Tipo Estación</th><th>Operaciones</th></tr></thead>';
   		rpta = rpta + '<tbody>';
   		for (var i = 0; i < estaciones.length; i++) {
		  	rpta = rpta + '<tr>';
		  	var operaciones = '<td><i class="fa fa-map-marker" aria-hidden="true" operacion="mostrarMapa"></i><i class="fa fa-pencil" aria-hidden="true" operacion="editarEstacion"></i><i class="fa fa-times" aria-hidden="true" operacion="eliminarEstacion"></i></td>';
		  	rpta = rpta +
          '<td class="oculto">' + estaciones[i]['id'] + '</td>' +
          '<td>' + '<input type="text" value="'+ estaciones[i]['nombre'] + '">' +'</td>' +
          '<td>' + '<input type="text" value="'+ estaciones[i]['descripcion'] + '">' +'</td>' +
          '<td>' + '<input type="text" value="'+ estaciones[i]['latitud'] + '">' +'</td>' +
          '<td>' + '<input type="text" value="'+ estaciones[i]['longitud'] + '">' +'</td>' +
          '<td>' + '<input type="text" value="'+ estaciones[i]['altura'] + '">' +'</td>' +
          '<td>' + helperSelectTipoEstacion(tipo_estaciones, estaciones[i]['tipo_estacion_id']) + '</td>' + operaciones;
		  	rpta = rpta + '</tr>';
  		}
  		rpta = rpta + '</tbody>';
  		rpta = rpta + '<tfoot><tr><td  colspan="3"><button class="btn btn-primary" id="btnAgregarEstacion"><i class="fa fa-plus" aria-hidden="true"></i>Agregar Estacion</button></tr></td></tfoot>';
   		$('#tablaEstaciones').append(rpta);
    }
  });
});

$(document).on('click', '#btnAgregarEstacion', function(event) {
	var id_boton = $(event.currentTarget).attr('id');
  var tipo_estaciones = getTipoEstacion();
  var fila = '<tr><td class="oculto">E</td><td><input type="text"></td><td><input type="text"></td><td><input type="text"></td><td><input type="text"></td><td><input type="text"></td><td>' + helperSelectTipoEstacion(tipo_estaciones, 99999) + '</td><td><i class="fa fa-plus" aria-hidden="true" operacion="crearEstacion"></i><i class="fa fa-times" aria-hidden="true" operacion="eliminarEstacion"></i></td></tr>';
  $('#tablaEstaciones tbody').append(fila);
});

$(document).on('click', '.fa', function(event) {
  var operacion = $(event.currentTarget).attr('operacion');
  switch(operacion) {
    //Inicio tabla departamento
    case 'cargarProvincia':
      var departamentoId = $(event.currentTarget).parent().parent().children().eq(0).html();
      cargarProvincia(departamentoId);
      break;
    case 'crearEstacion':
      var estacion = new Object();
      estacion.nombre = $(event.currentTarget).parent().parent().children().eq(1).children().val();
      estacion.descripcion = $(event.currentTarget).parent().parent().children().eq(2).children().val();
      estacion.latitud = $(event.currentTarget).parent().parent().children().eq(3).children().val();
      estacion.longitud = $(event.currentTarget).parent().parent().children().eq(4).children().val();
      estacion.altura = $(event.currentTarget).parent().parent().children().eq(5).children().val();
      estacion.tipo_estacion_id = $(event.currentTarget).parent().parent().children().eq(6).children().val();
      var fila = $(event.currentTarget).parent().parent();
      crearEstacion(estacion, fila);
      break;
    case 'editarEstacion':
        var estacion = new Object();
        estacion.id = $(event.currentTarget).parent().parent().children().eq(0).html();
        estacion.nombre = $(event.currentTarget).parent().parent().children().eq(1).children().val();
        estacion.descripcion = $(event.currentTarget).parent().parent().children().eq(2).children().val();
        estacion.latitud = $(event.currentTarget).parent().parent().children().eq(3).children().val();
        estacion.longitud = $(event.currentTarget).parent().parent().children().eq(4).children().val();
        estacion.altura = $(event.currentTarget).parent().parent().children().eq(5).children().val();
        estacion.tipo_estacion_id = $(event.currentTarget).parent().parent().children().eq(6).children().val();
        editarEstacion(estacion);
        break;
    case 'eliminarEstacion':
      var estacionId = $(event.currentTarget).parent().parent().children().eq(0).html();
      var fila = $(event.currentTarget).parent().parent();
      eliminarEstacion(estacionId, fila);
    break;
    case 'mostrarMapa':
      var nombre = $(event.currentTarget).parent().parent().children().eq(1).children().val();
      var latitud = $(event.currentTarget).parent().parent().children().eq(3).children().val();
      var longitud = $(event.currentTarget).parent().parent().children().eq(4).children().val();
      var altura = $(event.currentTarget).parent().parent().children().eq(5).children().val();
      mostrarMapa(nombre, latitud, longitud, altura);
    break;
  default:
    alert('Operacion ' + operacion + ' no implementada');
  }
});

function eliminarEstacion(estacionId, fila){
  if (estacionId == 'E'){
    fila.remove();
  }else{
    var estacion = new Object();
    estacion.id = estacionId;
    $.ajax({
      url: BASE_URL + 'estacion/eliminar',
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


function mostrarMapa(nombre, latitud, longitud, altura){
  $('#btnModal').click();
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -11.729697, lng: -75.27832},
    zoom: 2
  });
  var marker = new google.maps.Marker({
    position: {lat: parseFloat(latitud), lng: parseFloat(longitud)},
    map: map,
    title: 'Hello World!'
  });
}

function editarEstacion(estacion){
  $.ajax({
    url: BASE_URL + 'estacion/editar',
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


function crearEstacion(estacion, fila){
  $.ajax({
    url: BASE_URL + 'estacion/crear',
    type: "POST",
    async: false,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    data : JSON.stringify(estacion),
    success: function(data) {
      var rpta = data;
      fila.children().eq(0).html(rpta['mensaje'][1]);
      fila.children().eq(7).empty();
      fila.children().eq(7).append('<i class="fa fa-map-marker" aria-hidden="true" operacion="mostrarMapa"></i><i class="fa fa-pencil" aria-hidden="true" operacion="editarEstacion"></i><i class="fa fa-times" aria-hidden="true" operacion="eliminarEstacion"></i>');
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
