#!/usr/bin/env python
# -*- coding: utf-8 -*-
import json
from bottle import Bottle, request
from sqlalchemy.sql import select
from config.models import TipoEstacion
from config.database import engine, session_db
from config.cors import enable_cors

tipo_estacion_view = Bottle()

@tipo_estacion_view.route('/listar', method='GET')
@enable_cors
def listar():
	conn = engine.connect()
	stmt = select([TipoEstacion])
	return json.dumps([dict(r) for r in conn.execute(stmt)])

@tipo_estacion_view.route('/crear', method='OPTIONS')
@tipo_estacion_view.route('/crear', method='POST')
@enable_cors
def crear():
	rpta = None
	nuevo_id = None
	try:
		data = json.loads(request.body.read().decode('UTF-8'))
		session = session_db()
		s = TipoEstacion(nombre = data['nombre'])
		session.add(s)
		session.flush()
		nuevo_id = s.id
		session.commit()
		rpta = {'tipo_mensaje' : 'success', 'mensaje' : ['Se ha creado un tipo estación', nuevo_id]}
	except Exception as e:
		session.rollback()
		rpta = {'tipo_mensaje' : 'error', 'mensaje' : ['Se ha producido un error en crear un nuevo tipo de estación', str(e)]}
	return json.dumps(rpta)

@tipo_estacion_view.route('/editar', method='OPTIONS')
@tipo_estacion_view.route('/editar', method='POST')
@enable_cors
def editar():
	rpta = None
	try:
		data = json.loads(request.body.read().decode('UTF-8'))
		session = session_db()
		session.query(TipoEstacion).filter_by(id = data['id']).update(data)
		session.commit()
		rpta = {'tipo_mensaje' : 'success', 'mensaje' : ['Se ha editado un tipo estacións']}
	except Exception as e:
		session.rollback()
		rpta = {'tipo_mensaje' : 'error', 'mensaje' : ['Se ha producido un error en editar un tipo de estación', str(e)]}
	return json.dumps(rpta)


@tipo_estacion_view.route('/eliminar', method='OPTIONS')
@tipo_estacion_view.route('/eliminar', method='POST')
@enable_cors
def eliminar():
	rpta = None
	try:
		data = json.loads(request.body.read().decode('UTF-8'))
		session = session_db()
		session.query(TipoEstacion).filter_by(id = data['id']).delete()
		session.commit()
		rpta = {'tipo_mensaje' : 'success', 'mensaje' : ['Se ha eliminado un tipo estacións']}
	except Exception as e:
		session.rollback()
		rpta = {'tipo_mensaje' : 'error', 'mensaje' : ['Se ha producido un error en eliminar un tipo de estación', str(e)]}
	return json.dumps(rpta)
