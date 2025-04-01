<?php
/*
-------------------------------------------------------------------------------
@about		Clase comunica a entidad ITEM del modelo.
@author		CCasanova, JCorvalan
@date		28/03/2025
@require	class.qErrores.php
			class.ConexionMysql.php
-------------------------------------------------------------------------------
*/

class Item extends ConexionMysql
{
	# Propiedades
	protected	$id_item;
	protected	$id_seccion;
	protected	$id_tipo;
	protected	$id_item_padre	= -1;
	
	# Getters & Setters
	public function setID($valor)		{ $this->id_item	= $valor; }
	public function setSeccion($valor)	{ $this->id_seccion	= $valor; }
	public function setTipo($valor)		{ $this->id_tipo	= $valor; }
	public function setPadre($valor)	{ $this->id_item_padre	= $valor; }
	
	# Constructor
	public function __construct($conexion)
	{
		$this->setConexionMysql($conexion);
	}

	# Metodos de Lectura:
	public function lista($incluir_parametros = true)
	{
		$this->clearError();
		$lista	= false;
		try
		{
			# Filtros:
			$condicion	= array();
			if (!empty($this->id_seccion))
			{
				$condicion[]	= "id_seccion = '".$this->id_seccion."'";
			}
			if (!empty($this->id_tipo))
			{
				$condicion[]	= "id_tipo = '".$this->id_tipo."'";
			}
			if ($this->id_item_padre > -1)
			{
				$condicion[]	= "id_item_padre = ".$this->id_item_padre;
			}
			
			# Ejecuta consulta:
			$lista	= $this->ejecutarSQL("SELECT * FROM vw_items ".(count($condicion) > 0 ? "WHERE ".implode(" AND ", $condicion): "")." ORDER BY orden ASC");
			
			if (is_array($lista) && count($lista) > 0)
			{
				# Incluye Parametros de Item:
				if ($incluir_parametros)
				{
					$f = 0;
					# Ejecuta consulta para obtener los parametros:
					foreach ($lista as $fila)
					{
						$params	= $this->ejecutarSQL("SELECT id_param, valor FROM parametro_item WHERE id_item = ".$fila["id_item"]);
						$lista[$f]["parametros"]	= $params;
						$f++;
					}
				}
			}
		}
		catch (Exception $exc)
		{
			$this->setError(1, $exc->getMessage());
		}
		return $lista;
	}
}
?>