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
	
}
?>