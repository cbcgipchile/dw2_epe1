<?php
/**
-------------------------------------------------------------------------------
@about	Modulo retorna la Imagen en formato WEBP si existe. De lo contrario,
		retorna la imagen solicitada.
		Opcionalmente, genera y retorna la imagen WEBP a partir de la solicitada.
@author	Carolina Casanova G., aka, quinqui
@date	06/05/2022
@update	11/05/2022 quinqui:
		- Agregado validacion "Navegador acepta WEBP".
@param	$_GET["img"]	string		URL de la imagen.
@param	$_GET["f"]		boolean		Opcional. Forzar a convertir la imagen a WEBP.
-------------------------------------------------------------------------------
*/

// error_reporting(E_ALL ^ E_NOTICE);

# ---------------------------
# Origen y Destino:
$_url		= (isset($_GET["img"]) ? $_GET["img"]: "");
$_forzar	= (isset($_GET["f"]) ? ($_GET["f"] == 1): false);
$murl		= (!empty($_url) ? $_url: "");

$mAceptaWebp	= (strpos($_SERVER['HTTP_ACCEPT'], "image/webp") !== false);

# ---------------------------
# Si imagen solicitada existe:
# ---------------------------
if (file_exists($murl))
{
	$mmime	= mime_content_type($murl);
	// print_r($mmime); exit;
	
	# -----------------------
	# Si Origen no es WEBP y el Navegador acepta WEBP:
	if (strpos($mmime, "webp") === false
		&& $mAceptaWebp)
	{
		# -------------------
		# Busca la version en WEBP:
		$minfo	= pathinfo($murl);
		// print_r($minfo); exit;
		
		$mexts	= array("webp", "WEBP");
		$mfile	= $minfo["dirname"]."/".$minfo["filename"].".";
		
		foreach ($mexts as $mext)
		{
			$mbuscar	= $mfile.$mext;
			if (file_exists($mbuscar))
			{
				$mmime	= mime_content_type($mbuscar);
				$murl	= $mbuscar;
				break;
			}
		}
		// print_r($murl); print_r($mmime); exit;
	}
}
# ---------------------------
# Salida:
# ---------------------------
if (file_exists($murl) && !empty($mmime))
{
	# ---------------------------------
	# Si no encontro la version WEBP, 
	# y se ha especificado que FUERCE su retorno 
	# y el Navegador acepta WEBP:
	if ($_forzar
		&& strpos($mmime, "webp") === false
		&& $mAceptaWebp)
	{
		$_GET["url"]	= $murl;
		include "_ext/img2webp.php";
	}
	# ---------------------------------
	# Si encontro la imagen WEBP o no estaba forzado a encontrarla:
	else
	{
		header('Content-type:'.$mmime);
		readfile($murl);
	}
}
?>