<?php
/*
-------------------------------------------------------------------------------
@about		Clase comunica a entidad SECCION del modelo.
@author		CCasanova, JCorvalan
@date		28/03/2025
@require	class.qErrores.php
			class.ConexionMysql.php
-------------------------------------------------------------------------------
*/

class Seccion extends ConexionMysql
{
	# Constructor
	public function __construct($conexion)
	{
		$this->setConexionMysql($conexion);
	}
	
	# Metodos de Lectura:
	public function lista()
	{
		$this->clearError();
		$lista	= false;
		try
		{
			# Ejecuta consulta:
			$lista	= $this->ejecutarSQL("SELECT * FROM seccion ORDER BY orden ASC");
		}
		catch (Exception $exc)
		{
			$this->setError(1, $exc->getMessage());
		}
		return $lista;
	}
}
?>