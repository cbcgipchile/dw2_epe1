<?php
/*
-------------------------------------------------------------------------------
@about		Recibe solicitudes desde FrontEnd.
@author		Carolina Casanova G.
@date		25/03/2025
-------------------------------------------------------------------------------
*/

# Manejo de mensajes de error:
error_reporting(E_ALL ^ E_NOTICE);

# ---------------------------
# Llamada librerias y modulos requeridos:
# ---------------------------

# Conexion a BD:
require_once "ctrl/lib/class.ConexionMysql.php";
include "ctrl/inc/data.config.php";
include "ctrl/inc/data.conexion.php";

# Clases del Modelo:
require_once "ctrl/lib/class.PSeccion.php";
require_once "ctrl/lib/class.PItem.php";

# Modulos requeridos:
include "ctrl/inc/req.variables.php";
include "ctrl/inc/data.request.php";

?>