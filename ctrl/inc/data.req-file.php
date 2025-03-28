<?php
/*
-------------------------------------------------------------------------------
@about		Solicita datos requeridos a archivos JSON locales (respaldo).
@author		Carolina Casanova G.
@date		25/03/2025
@require	Variables globales: $_RESULT, las recibidas desde req.variables.php
-------------------------------------------------------------------------------
*/
$mmodelo	= array("seccion", "item_seccion");

# Busca en el modelo la entidad solicitada:
if (isset($entidad) && !empty($entidad) && in_array($entidad, $mmodelo))
{
	# Busca el archivo solicitado:
	$mruta	= "./ctrl/data/".$entidad.".json";

	// $_RESULT["trace"][]	= "Buscando archivo ".$mruta;

	if (is_file($mruta))
	{
		// $_RESULT["trace"][]	= "Archivo ".$mruta." encontrado.";
		
		# Obtiene el contenido del archivo encontrado:
		$mcont	= file_get_contents($mruta);
		
		if (!empty($mcont))
		{
			// $_RESULT["trace"][]	= "Contenido: ".$mcont;
			$mjson	= json_decode($mcont, true);
			
			if (is_array($mjson))
			{
				// $_RESULT["trace"][]	= $mjson;
				
				# Verifica si hay filtros, recorre el resultado y retorna
				# solo los resultados coincidentes:
				$mresult	= array();
				$mfiltros	= array();
				$mfiltrosKeys	= array("id_seccion", "id_seccion_padre", "id_tipo", "id_item_padre");
				
				foreach ($mfiltrosKeys as $mkey)
				{
					if (isset($$mkey) && $$mkey !== "")
					{
						$mfiltros[$mkey]	= $$mkey;
					}
				}
				
				# Si hay filtros:
				if (count($mfiltros) > 0)
				{
					foreach ($mjson as $mfila)
					{
						$mok	= 0;
						foreach ($mfiltros as $mkey => $mval)
						{
							if (isset($mfila[$mkey])
								&& $mfila[$mkey] == $mval)
							{
								$mok++;
							}
						}
						# Agrega el registro al resultado si cumplio todo los filtros:
						if ($mok == count($mfiltros))
						{
							$mresult[]	= $mfila;
						}
					}
				}
				# Si no hay filtros:
				else
				{
					# Retorna el resultado tal cual viene:
					$mresult	= $mjson;
				}
				$_RESULT["datos"]	= $mresult;
				$_RESULT["error"]	= false;	// Resetea el error por ahora.
			}
			else
			{
				$_RESULT["error"]	= "Error de formato de archivo ".$entidad;
			}
		}
		else
		{
			$_RESULT["error"]	= "Archivo ".$entidad." vacio";
		}
	}
	else
	{
		$_RESULT["error"]	= "Archivo ".$entidad." no encontrado";
	}
}
else
{
	$_RESULT["error"]	= "Solicitud invalida";
}

?>