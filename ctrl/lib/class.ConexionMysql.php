<?php
/**
-------------------------------------------------------------------------------
@about	Clase Maneja Conexion a Servidor y BD MYSQL
@author	Carolina Casanova Garcia
@date	04/06/2015
-------------------------------------------------------------------------------
*/

if (!class_exists("qErrores"))
{
	require_once "class.qErrores.php";
}

class ConexionMysql extends qErrores
{
	/**
	--------------------------------------
	
	PROPIEDADES
	
	--------------------------------------
	*/
	
	protected	$bd_host	= "";
	protected	$bd_port	= 3306;
	protected	$bd_user	= "";
	protected	$bd_pass	= "";
	protected	$bd_bd		= "";
	protected	$bd_library	= "mysqli";
	
	protected	$bd_conexion_mysql		= null;
	protected	$bd_filas_retornadas	= 0;
	protected	$bd_filas_afectadas		= 0;
	protected	$bd_ult_id_insertado	= 0;
	protected	$pag_total_items		= 0;
	
	public function setHost($cval)
	{
		$this->bd_host	= $cval;
	}
	public function setPort($cval)
	{
		$this->bd_port	= $cval;
	}
	public function setUser($cval)
	{
		$this->bd_user	= $cval;
	}
	public function setPassword($cval)
	{
		$this->bd_pass	= $cval;
	}
	public function setDatabase($cval)
	{
		$this->bd_bd	= $cval;
	}
	public function setLibrary($cval)
	{
		$this->bd_library	= $cval;
	}
	public function setConexionMysql($cval)
	{
		$this->bd_conexion_mysql	= $cval;
	}
	
	/**
	--------------------------------------
	
	METODOS
	
	--------------------------------------
	*/
	
	/**
	--------------------------------------
	@return	boolean
	*/
	public function conectar()
	{
		$this->clearError();
		$cconexion	= false;
		
		if (empty($this->bd_host))
		{
			$this->setError(4, "Host");
		}
		elseif (empty($this->bd_user))
		{
			$this->setError(4, "User");
		}
		else
		{
			# Intenta Conectar a Host :
			switch ($this->bd_library)
			{
				default:
				{
					if (class_exists("mysqli"))
					{
						$cconexion	= @new mysqli($this->bd_host, $this->bd_user, $this->bd_pass, $this->bd_bd, $this->bd_port);
						
						/*?><pre><?php print var_dump($cconexion); ?></pre><?php*/
						
						if ($cconexion->connect_errno > 0)
						{
							$this->setError(2, $cconexion->connect_error, $cconexion->connect_errno);
						}
					}
					else
					{
						$this->setError(4, "El servidor no cuenta con la clase Mysqli. Contacte al Administrador de la página para resolver este problema.");
					}
				}
			}
		}
		return $cconexion;
	}
	
	/**
	--------------------------------------
	@about	Retorna -1 en caso de Error.
	@param	$csql	string	Consulta a BD
	@return	array/boolean/integer
	*/
	protected function ejecutarSQL($csql, $cmotor = "mysql")
	{
		$this->clearError();
		$csql		= trim($csql);
		$cresult	= -1;
		
		if (!empty($csql))
		{
			print ($this->debug ? "\n<!-- [ejecutarSQL][Sql] ".$csql." -->\n": "");
			
			// *** Por ahora definida solo para MYSQL, luego le agregaré SQL ***
			switch ($cmotor)
			{
				case "mysql":
				{
					$cconexion	= $this->bd_conexion_mysql;
					
					// Utiliza libreria Mysqli de PHP:
					if (isset($cconexion->connect_errno))
					{
						if ($cconexion->connect_errno == 0)
						{
							$this->bd_filas_retornadas	= 0;
							$this->bd_filas_afectadas	= 0;
							$this->bd_ult_id_insertado	= 0;
							
							$ctrozo	= strtolower(substr($csql, 0, 9));
							
							# Ejecuta Query:
							$cresult	= $cconexion->query($csql);
							
							# Manejo de Consultas de Seleccion:
							if ($ctrozo == "describe" ||
								substr($ctrozo, 0, 6) == "select" ||
								substr($ctrozo, 0, 4) == "show" ||
								substr($ctrozo, 0, 7) == "explain")
							{
								$this->bd_filas_retornadas	= $cresult->num_rows;
								$this->pag_total_items		= $this->bd_filas_retornadas;
								
								if ($cresult === false)
								{
									$this->setError(2, $cconexion->error, $cconexion->errno);
								}
								else
								{
									# Retornara el resultado como un array hash:
									$ctemp	= array();
									if ($cresult->num_rows > 0)
									{
										while ($cfila = $cresult->fetch_assoc())
										{
											$ctemp[]	= $cfila;
										}
									}
									$cresult->free();
									$cresult	= $ctemp;
									unset($ctemp);
								}
							}
							# Manejo de Consultas de Actualizacion:
							else
							{
								if ($cresult === false)
								{
									$this->setError(2, $cconexion->error, $cconexion->errno);
								}
								// Se usa el valor directo recibido en $cresult (True/False)
								
								# Obtiene datos relacionados:
								$this->bd_filas_afectadas	= $cconexion->affected_rows;
								$this->bd_ult_id_insertado	= $cconexion->insert_id;
							}
						}
						else
						{
							$this->setError(2, $cconexion->connect_error, $cconexion->connect_errno);
						}
					}
					else
					{
						$this->setError(4, "Conexion Mysql");
					}
					break;
				}
				
			} #---Fin Switch Motor---
		}
		else
		{
			$this->setError(4, "Consulta SQL");
		}
		return $cresult;
	}
}
?>