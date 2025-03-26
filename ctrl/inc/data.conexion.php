<?php
/*
-------------------------------------------------------------------------------
@about		Conecta a la Base de datos.
@author		Carolina Casanova G.
@date		25/03/2025
@require	data.config.php
			class.ConexionMysql.php
-------------------------------------------------------------------------------
*/

$mconectando	= new ConexionMysql();
$mconectando->setHost(CONX_BD_HOST);
$mconectando->setPort(CONX_BD_PORT);
$mconectando->setUser(CONX_BD_USER);
$mconectando->setPassword(CONX_BD_PASS);
$mconectando->setDatabase(CONX_BD_BASE);
$mconectando->setLibrary("mysqli");

$_conexion_bd	= $mconectando->conectar();

if ($mconectando->getError() !== false)
{
	$_conexion_error	= $mconectando->getError();
}
unset($mconectando);
?>