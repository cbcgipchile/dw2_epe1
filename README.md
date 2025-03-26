# dw2_epe1
## Antecedentes del proyecto
* Actividad	: EPE1 (Primera Evaluación Parcial Estructurada)
* Institución	: IPCHILE
* Sede		: Campus Virtual
* Carrera		: Ingeniería en Informática
* Asignatura	: Desarrollo Web 2
* Estudiante	: Carolina Casanova García

## Descripción del proyecto
Se trata de una aplicación web que tiene por objetivo servir de portafolio personal y profesional de quien escribe.

### FrontEnd
La presentación de la aplicación está realizada utilizando HTML y CSS.
La carga de los datos en esta aplicación es realizada de forma asíncrona usando Vanilla JavaScript.

### BackEnd
El manejo de procesos en BackEnd es realizado usando scripts PHP.
La fuente de datos puede ser una base de datos MySQL. Pero en caso de no poder establecer la conexión, la segunda fuente de datos se encuentra en la carpeta de proyecto /ctrl/data . En ella, se encuentran archivos JSON que contienen los mismos datos que retornan las consultas SQL. El objetivo de estos archivos JSON es servir de respaldo en caso de pérdida de conexión con la base de datos, lo cual ocurrirá a quienes descarguen y ejecuten este proyecto en sus propios servidores web.