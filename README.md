# Parical - Programación Web

## Boilerplate Flask Python

Requisitos de software previamente instalado:

+ Python 3.4.3
+ Python PIP

### Instalación de Dependencias

    $ sudo apt-get install python-pip
    $ sudo pip install virtualenv
    $ virtualenv -p python3 py3
    $ cd py3
    $ source bin/activate
    $ pip install -r requirements.txt

### Para arrancar la aplicación:

    $ source bin/activate
    $ python app.py

Thanks/Credits

    Pepe Valdivia: developer Software Web Perú [http://softweb.pe]

### Descipción

Servicio web desarrollado en Python usando el framework Bottle, con base de datos SQLite3.

### Rutas

+ (1) GET : tipo_estacion/listar
+ (2) POST : tipo_estacion/crear
+ (3) POST : tipo_estacion/editar
+ (4) POST : tipo_estacion/eliminar
+ (5) GET : estacion/listar
+ (6) POST : estacion/crear
+ (7) POST : estacion/editar
+ (8) POST : estacion/eliminar

### Preguntas

Hacer vistas HTML para dar mantenimiento a las tablas 'estaciones' y 'tipo_estaciones', para lo cuál se debe seguir las siguientes operaciones:

+ Mostrar tipos de estaciones (servicio 1).
+ Crear tipos de  estaciónes (servicio 2).
+ Editar tipos de  estaciónes (servicio 3).
+ Eliminar tipos de  estaciónes (servicio 4).
+ Mostrar estaciones con su respectivo nombre de tipo de estación(servicio 5).
+ Crear estaciónes asociando su tipo de estación(servicio 6).
+ Editar estaciónes asociando su tipo de estación(servicio 7).
+ Eliminar estaciónes (servicio 8).
+ Mostrar con una marca en un mapa la ubicación de la estación usando su latitud y longitud.

---

#### Fuentes

+ https://bottlepy.org/docs/dev/
+ https://www.sqlalchemy.org/