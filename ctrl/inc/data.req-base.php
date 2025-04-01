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
	if (isset($entidad) && !empty($entidad))
	{
		$mEntidad	= null;
		switch ($entidad)
		{
			case "seccion"		: $mEntidad	= new Seccion($_conexion_bd); break;
			case "item_seccion"	: $mEntidad	= new Item($_conexion_bd); break;
		}

		# -------------------------------------
		# Proceso de Registro:
		# -------------------------------------
		if (isset($proceso))
		{
			if (count($_POST) > 0)
			{
				$mEntidad->setValores($_POST);
			}
			$_RESULT["datos"]	= (isset($actualizar) ? $mEntidad->actualizar(): $mEntidad->agregar());
		}
		# -------------------------------------
		# Solicitud de Datos (Lectura):
		# -------------------------------------
		else
		{
			if (isset($id_seccion) && !empty($id_seccion))
			{
				$mEntidad->setSeccion($id_seccion);
			}
			if (isset($id_tipo) && !empty($id_tipo))
			{
				$mEntidad->setTipo($id_tipo);
			}
			if (isset($id_item_padre) && $id_item_padre > -1)
			{
				$mEntidad->setPadre($id_item_padre);
			}
			$mlista	= $mEntidad->lista();
			$merror	= $mEntidad->getError();
			
			if ($merror === false)
			{
				if (is_array($mlista))
				{/*
					if (count($mlista) > 0)
					{
						# Reordena los resultados para dejarlos 
						# como Plain Object (JSON):
						$mheaders	= array_keys($mlista[0]);
						$mtemp		= $mlista;
						$mlista		= array();
						foreach ($mlista as $mfila)
						{
							$mreg	= array();
							foreach ($mheaders as $mkey)
							{
								$mreg[$mkey]	= $mfila[$mkey];
							}
							$mlista[]	= $mreg;
						}
					}*/
					$_RESULT["datos"]	= $mlista;
				}
				else
				{
					$_RESULT["error"]	= "Datos obtenidos no son validos";
				}
			}
			else
			{
				$_RESULT["error"]	= $merror["mensaje"]." (".$merror["codigo"].")";
			}
		}
	}
}
?>