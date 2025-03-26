<?php
/*
-------------------------------------------------------------------------------
@about		Solicita datos requeridos a base de datos.
@author		Carolina Casanova G.
@date		25/03/2025
@require	Variables globales: $_conexion_bd, $_RESULT
-------------------------------------------------------------------------------
*/

# Si hubo error en la conexion:
if ($_conexion_bd->connect_errno 
	&& $_conexion_bd->connect_errno > 0)
{
	$_RESULT["error"]	= $_conexion_bd->connect_error." (".$_conexion_bd->connect_errno.")";
}
# Si no hubo error:
else
{
	# Obtiene los datos desde consulta SQL:
}
?>