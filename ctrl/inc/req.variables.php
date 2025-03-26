<?php
/*
-------------------------------------------------------------------------------
@about		Recibe valores desde GET o POST.
@author		Carolina Casanova G.
@date		25/03/2025
-------------------------------------------------------------------------------
*/

# Genera variables variables a partir de los datos recibidos.
foreach ($_GET as $mkey => $mval)
{
	$$mkey	= $mval;
}
# Las variables recibidas por POST sobreescriben a las GET.
foreach ($_POST as $mkey => $mval)
{
	$$mkey	= $mval;
}
?>