#!/usr/bin/env python
# -*- coding: utf-8 -*-
import json
from bottle import Bottle, request
from sqlalchemy.sql import select
from config.models import TipoEstacion
from config.database import engine, session_db

tipo_estacion_view = Bottle()

@tipo_estacion_view.route('/listar', method='GET')
def listar():
	conn = engine.connect()
	stmt = select([TipoEstacion])
	return json.dumps([dict(r) for r in conn.execute(stmt)])

@tipo_estacion_view.route('/guardar', method='POST')
def guardar():
	data = json.loads(request.query.data)
	nuevos = data['nuevos']
	editados = data['editados']
	eliminados = data['eliminados']
	array_nuevos = []
	rpta = None
	session = session_db()
	try:
		if len(nuevos) != 0:
			for nuevo in nuevos:
				temp_id = nuevo['id']
				nombre = nuevo['nombre']
				s = TipoEstacion(nombre = nombre)
				session.add(s)
				session.flush()
				temp = {'temporal' : temp_id, 'nuevo_id' : s.id}
				array_nuevos.append(temp)
		if len(editados) != 0:
			for editado in editados:
				session.query(TipoEstacion).filter_by(id = editado['id']).update(editado)
		if len(eliminados) != 0:
			for id in eliminados:
				session.query(TipoEstacion).filter_by(id = id).delete()
		session.commit()
		rpta = {'tipo_mensaje' : 'success', 'mensaje' : ['Se ha registrado los cambios en los tipos de estaciones', array_nuevos]}
	except Exception as e:
		session.rollback()
		rpta = {'tipo_mensaje' : 'error', 'mensaje' : ['Se ha producido un error en guardar los tipos de estaciones', str(e)]}
	return json.dumps(rpta)