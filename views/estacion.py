#!/usr/bin/env python
# -*- coding: utf-8 -*-
import json
from bottle import Bottle, request
from sqlalchemy.sql import select
from config.models import Estacion
from config.database import engine, session_db
from config.cors import enable_cors

estacion_view = Bottle()

@estacion_view.route('/listar', method='GET')
@enable_cors
def listar():
	conn = engine.connect()
	stmt = select([Estacion])
	return json.dumps([dict(r) for r in conn.execute(stmt)])

@estacion_view.route('/crear', method='OPTIONS')
@estacion_view.route('/crear', method='POST')
@enable_cors
def crear():
	rpta = None
	nuevo_id = None
	try:
		data = json.loads(request.body.read().decode('UTF-8'))
		session = session_db()
		s = Estacion(nombre = data['nombre'], descripcion = data['descripcion'], latitud = data['latitud'], longitud = data['longitud'], altura = data['altura'], tipo_estacion_id = data['tipo_estacion_id'])
		session.add(s)
		session.flush()
		nuevo_id = s.id
		session.commit()
		rpta = {'tipo_mensaje' : 'success', 'mensaje' : ['Se ha creado una estación', nuevo_id]}
	except Exception as e:
		session.rollback()
		rpta = {'tipo_mensaje' : 'error', 'mensaje' : ['Se ha producido un error en crear una estación', str(e)]}
	return json.dumps(rpta)

@estacion_view.route('/editar', method='OPTIONS')
@estacion_view.route('/editar', method='POST')
@enable_cors
def editar():
	rpta = None
	try:
		data = json.loads(request.body.read().decode('UTF-8'))
		session = session_db()
		session.query(Estacion).filter_by(id = data['id']).update(data)
		session.commit()
		rpta = {'tipo_mensaje' : 'success', 'mensaje' : ['Se ha editado una estación']}
	except Exception as e:
		session.rollback()
		rpta = {'tipo_mensaje' : 'error', 'mensaje' : ['Se ha producido un error en editar una estación', str(e)]}
	return json.dumps(rpta)


@estacion_view.route('/eliminar', method='OPTIONS')
@estacion_view.route('/eliminar', method='POST')
@enable_cors
def eliminar():
	rpta = None
	try:
		data = json.loads(request.body.read().decode('UTF-8'))
		session = session_db()
		session.query(Estacion).filter_by(id = data['id']).delete()
		session.commit()
		rpta = {'tipo_mensaje' : 'success', 'mensaje' : ['Se ha eliminado una estación']}
	except Exception as e:
		session.rollback()
		rpta = {'tipo_mensaje' : 'error', 'mensaje' : ['Se ha producido un error en eliminar una estación', str(e)]}
	return json.dumps(rpta)
