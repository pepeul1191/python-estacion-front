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
		nombre = data['nombre']
		s = TipoEstacion(nombre = nombre)
		session.add(s)
		session.flush()
		nuevo_id = s.id
		rpta = {'tipo_mensaje' : 'success', 'mensaje' : ['Se ha creado un tipo estacións', nuevo_id]}
	except Exception as e:
		session.rollback()
		rpta = {'tipo_mensaje' : 'error', 'mensaje' : ['Se ha producido un error en crear un nuevo tipo de estación', str(e)]}
	return json.dumps(rpta)