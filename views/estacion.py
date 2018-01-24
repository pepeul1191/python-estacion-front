#!/usr/bin/env python
# -*- coding: utf-8 -*-
import json
from bottle import Bottle, request
from sqlalchemy.sql import select
from config.models import Estacion
from config.database import engine, session_db

estacion_view = Bottle()

@estacion_view.route('/listar', method='GET')
def listar():
	conn = engine.connect()
	stmt = select([Estacion])
	return json.dumps([dict(r) for r in conn.execute(stmt)])

@estacion_view.route('/campo/<campo_id>')
def index(campo_id):
	conn = engine.connect()
	stmt = select([Estacion]).where(Estacion.campo_id == campo_id)
	return json.dumps([dict(r) for r in conn.execute(stmt)])

@estacion_view.route('/guardar', method='POST')
def guardar():
	data = json.loads(request.query.data)
	nuevos = data['nuevos']
	editados = data['editados']
	eliminados = data['eliminados']
	campo_id = data['extra']['campo_id']
	array_nuevos = []
	rpta = None
	session = session_db()
	try:
		if len(nuevos) != 0:
			for nuevo in nuevos:
				temp_id = nuevo['id']
				nombre = nuevo['nombre']
				descripcion = nuevo['descripcion']
				latitud = nuevo['latitud']
				longitud = nuevo['longitud']
				altura = nuevo['altura']
				tipo_estacion_id = nuevo['tipo_estacion_id']
				s = Estacion(nombre = nombre, descripcion = descripcion, latitud = latitud, longitud = longitud, altura = altura, tipo_estacion_id = tipo_estacion_id, campo_id = campo_id)
				session.add(s)
				session.flush()
				temp = {'temporal' : temp_id, 'nuevo_id' : s.id}
				array_nuevos.append(temp)
		if len(editados) != 0:
			for editado in editados:
				session.query(Estacion).filter_by(id = editado['id']).update(editado)
		if len(eliminados) != 0:
			for id in eliminados:
				session.query(Estacion).filter_by(id = id).delete()
		session.commit()
		rpta = {'tipo_mensaje' : 'success', 'mensaje' : ['Se ha registrado los cambios en las estaciones', array_nuevos]}
	except Exception as e:
		session.rollback()
		rpta = {'tipo_mensaje' : 'error', 'mensaje' : ['Se ha producido un error en guardar las estaciones', str(e)]}
	return json.dumps(rpta)