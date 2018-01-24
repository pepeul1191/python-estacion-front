# -*- coding: utf-8 -*-
from sqlalchemy import Table, Column, Integer, String, ForeignKey, Float
from config.database import Base
# http://docs.sqlalchemy.org/en/latest/orm/basic_relationships.html
class UnidadMedida(Base):
	__tablename__ = 'unidad_medidas'
	id = Column(Integer, primary_key=True)
	nombre = Column(String)
	simbolo = Column(String)

class TipoEstacion(Base):
	__tablename__ = 'tipo_estaciones'
	id = Column(Integer, primary_key=True)
	nombre = Column(String)

class Estacion(Base):
	__tablename__ = 'estaciones'
	id = Column(Integer, primary_key=True)
	nombre = Column(String)
	descripcion = Column(String)
	latitud = Column(Float)
	longitud = Column(Float)
	altura = Column(Float)
	campo_id = Column(Integer)
	tipo_estacion_id = Column(Integer, ForeignKey('tipo_estaciones.id'))

class Sensor(Base):
	__tablename__ = 'sensores'
	id = Column(Integer, primary_key=True)
	nombre = Column(String)
	descripcion = Column(String)
	unidad_medida_id = Column(Integer, ForeignKey('unidad_medidas.id'))
	estacion_id = Column(Integer, ForeignKey('estaciones.id'))