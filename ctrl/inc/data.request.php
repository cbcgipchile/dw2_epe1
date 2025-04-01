<?php
/*
-------------------------------------------------------------------------------
@about		Recibe solicitud de datos y los retorna en formato JSON.
@author		Carolina Casanova G.
@date		25/03/2025
-------------------------------------------------------------------------------
*/

# Variable a ser convertida en JSON al finalizar la ejecucion del script:
$_RESULT	= array("datos"		=> null,
					"origen"	=> null,
					"error"		=> false);

# ---------------------------
# Si hay conexion a la base de datos:
# ---------------------------
if (isset($_conexion_bd) && $_conexion_bd)
{
	include "data.req-base.php";
	$_RESULT["origen"]	= "base";
}
# ---------------------------
# Si no hay conexion a base de datos, intenta obtener los datos desde
# archivos JSON en carpeta "data": esto como respaldo cuando se pierda
# la conexion a la base de datos.
# ---------------------------
if (is_null($_RESULT["datos"]) 
	|| (is_array($_RESULT["datos"]) && count($_RESULT["datos"]) == 0))
{
	include "data.req-file.php";
	$_RESULT["origen"]	= "file";
}
# ---------------------------
# Salida de resultado
# ---------------------------
print json_encode($_RESULT);
?>