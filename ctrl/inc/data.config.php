<?php
/*
-------------------------------------------------------------------------------
@about		Establece los valores de conexion a base de datos.
@author		Carolina Casanova G.
@date		25/03/2025
-------------------------------------------------------------------------------
*/

if (!defined("CONX_BD_TIMEZONE")) { define("CONX_BD_TIMEZONE", "America/Santiago"); }
define("CONX_BD_HOST", "localhost");
define("CONX_BD_PORT", 3307);
define("CONX_BD_USER", "dw2_epe1");
define("CONX_BD_PASS", pack("H*", "514D696172656C323032302A"));
define("CONX_BD_BASE", "dw2_epe1");

?>