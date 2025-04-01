<?php
/**
-------------------------------------------------------------------------------
@phpversion	5+
@author	Carolina Casanova Garcia
@date	04/11/2011
@update	05/05/2015 CBCG: Modificado propiedades. Ahora salida de getError es bool/array().
-------------------------------------------------------------------------------
*/

class qErrores
{
	protected	$hayError	= false;
	protected	$tipoError	= "";
	protected	$codError	= "";
	protected	$msjeError	= "";
	
	/**
	------------------------------------
	@about	Asigna mensaje a Error
	@author	Carolina Casanova Garcia
	@date	04/11/2011
	*/
	protected function setError($ctipo, $cmensaje = "", $ccodigo = "")
	{
		$cerrores	= array(1	=>	"Valor Incorrecto",
							2	=>	"Error SQL",
							3	=>	"Falta Definir Parametros",
							4	=>	"Faltan Parametros");
		$this->hayError		= true;
		$this->tipoError	= (isset($cerrores[$ctipo]) ? $cerrores[$ctipo]: "Error No Definido");
		$this->codError		= $ccodigo;
		$this->msjeError	= (isset($cerrores[$ctipo]) ? $cerrores[$ctipo]: "Error").(!empty($cmensaje) ? ": ".$cmensaje: "").(!empty($ccodigo) ? " (Cod. ".$ccodigo.")": "");
	}
	
	/**
	------------------------------------
	@about	Limpia variables de Error
	@author	Carolina Casanova Garcia
	@date		04/11/2011
	*/
	protected function clearError()
	{
		$this->hayError		= false;
		$this->tipoError	= "";
		$this->codError		= "";
		$this->msjeError	= "";
	}

	/**
	------------------------------------
	@about	Retorna Info de Error
	@author	Carolina Casanova Garcia
	@date	04/11/2011
	@update	05/05/2015 CBCG: Retorna False si no hay Error, Array si lo hay.
	@return	bool/array
	*/
	public function getError()
	{
		$cerror	= false;
		if ($this->hayError)
		{
			$cerror	= array("error"		=>	$this->hayError,
							"tipo"		=>	$this->tipoError,
							"mensaje"	=>	$this->msjeError,
							"codigo"	=>	$this->codError);
		}
		return $cerror;
	}
	
}
?>