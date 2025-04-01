/*
-------------------------------------------------------------------------------
@about	CLASE Manejador de Llamada Asincrona.
@author	Carolina Casanova G.
@date	21/04/2023
@update	28/07/2024 ccasanova: Agregado metodo setDebug.
@update	25/03/2025 ccasanova: Adaptada para DW2_EPE1.
-------------------------------------------------------------------------------
*/

class QAsinc
{
	/*
	-------------------------------
	PROPIEDADES
	-------------------------------
	*/
	#_debug		= false;

	#_conexion	= undefined;
	
	#_tipo		= "xmlhttprequest";
	#_url		= "";
	#_puerto	= 0;
	#_params	= undefined;		// Objeto plano a enviar durante la conexion.
	#_metodo	= "GET";			// Otros valores: "POST".
	
	#_tipos		= ["xmlhttprequest"];
	// Acciones a realizar en determinados momentos de la conexion:
	//	cb 	function		Callback
	//	pa	plain object	Parametros extra a enviar al Callback
	#_callbacks	=
		{
			// Funcion a ejecutar justo al inicio del intento de conexion:
			iniciado	:
				{
					cb	: undefined,
					pa	: undefined
				},
			// Funcion a ejecutar al concretar la conexion:
			conectado	:
				{
					cb	: undefined,
					pa	: undefined
				},
			// Funcion a ejecutar al terminar el intento de conexion:
			terminado	:
				{
					cb	: undefined,
					pa	: undefined
				},
			// Funcion a ejecutar en caso de error de la conexion:
			error		:
				{
					cb	: undefined,
					pa	: undefined
				}
		};
	/*
	-------------------------------
	@about	Establece las funciones para los eventos.
	@author	ccasanova
	@date	21/04/2023
	@return	void
	*/
	setCallback(fNombre, fCall, fParams)
	{
		if (Object.keys(this.#_callbacks).includes(fNombre))
		{
			this.#_callbacks[fNombre].cb	= fCall;
			if (fParams != undefined)
			{
				this.#_callbacks[fNombre].pa	= fParams;
			}
		}
	}
	setDebug(fOk)
	{
		this.#_debug	= fOk;
	}
	/*
	-------------------------------
	METODOS:
	-------------------------------
	*/
	
	/*
	-------------------------------
	@about	Constructor de Clase
	@author	ccasanova
	@date	21/04/2023
	@return	void
	*/
	constructor(fUrl, fPuerto, fParams, fMetodo)
	{
		this.#_tipo		= "xmlhttprequest";
		this.#_url		= fUrl;
		this.#_puerto	= fPuerto || 0;
		this.#_params	= fParams || undefined;
		this.#_metodo	= fMetodo || "GET";
	}
	/*
	-------------------------------
	@about	Muestra mensajes de depuracion en consola, si la propiedad debug es TRUE.
	@author	ccasanova
	@date	20/04/2023
	@return	void
	*/
	depurar(fMsje, fDatos)
	{
		if (this.#_debug)
		{
			console.log(fMsje);
			if (fDatos != undefined)
			{
				console.log(fDatos);
			}
		}
	}
	/*
	-------------------------------
	@about	Informa si el elemento especificado es de tipo Function.
	@author	ccasanova
	@date	26/05/2022
	@return	boolean
	*/
	isFunction(fFuncion)
	{
		return (typeof fFuncion === "function");
	}
	/*
	-------------------------------
	@about	Retorna lista de parametros en la forma: "key=value"
	@author	ccasanova
	@date	21/04/2023
	@return	array
	*/
	queryParams(fParamsObj)
	{
		var fQuery	= [];
		if (fParamsObj && (Array.isArray(fParamsObj) || Object.keys(fParamsObj).length > 0))
		{
			if (Array.isArray(fParamsObj))
			{
				fQuery	= fParamsObj;
			}
			else
			{
				for (let f in fParamsObj)
				{
					fQuery.push(f + "=" + encodeURIComponent(fParamsObj[f]));
				}
			}
		}
		return fQuery;
	}
	/*
	-------------------------------
	@about	Ejecuta la funcion especificada.
	@author	ccasanova
	@date	26/05/2022
	@return	void
	*/
	ejecutar(fTipo, fResp)
	{
		if (this.isFunction(this.#_callbacks[fTipo].cb))
		{
			this.depurar("[" + this.tipo + ":" + fTipo + "] Iniciada.", { datos:fResp, params:this.#_callbacks[fTipo].pa });
			
			if (this.#_callbacks[fTipo].pa !== undefined)
			{
				this.#_callbacks[fTipo].cb(fResp, this.#_callbacks[fTipo].pa);
			}
			else
			{
				this.#_callbacks[fTipo].cb(fResp);
			}
		}
	}
	/*
	-------------------------------
	@about	Abre Conexion XMLHttpRequest y define su manejo de eventos.
	@author	ccasanova
	@date	25/05/2022
	@update	27/07/2023 ccasanova:
			- Ahora envia en send() los parametros recibidos sin procesar
			  (por si vienen preformateados, como FormData, etc.).
	@update	26/12/2023 ccasanova:
			- Agregado setRequestHeader() para cuando se envia por POST.
			- Ahora solo envia los parametros al URL si el metodo no es POST.
			- Ahora envia el array de Params al SEND(), de haber uno valido.
	@return	Object	La conexion realizada.
	*/
	abrirXMLHttpRequest()
	{
		var fConx;
		try
		{
			if (this.#_url != "")
			{
				var fThis	= this;
				fConx		= new XMLHttpRequest();
				fConx.onreadystatechange	= function()
					{
						if (this.readyState == 1)
						{
							// Funcion a ejecutar mientras Carga:
							fThis.ejecutar("iniciado",
								{ 
									status		: 
										{
											type	: "ok",
											code	: false,
											message	: "Iniciando Conexion",
											detail	: this
										}
								}
							);
						}
						if (this.readyState == 4)
						{
							let fResp	=
								{
									response	: this.responseText,
									status		: 
										{
											type	: (this.status >= 200 && this.status < 300 ? "ok": "error"),
											code	: this.status,
											message	: this.statusText,
											detail	: this
										}
								};
							
							// Funcion a ejecutar al Finalizar la Carga:
							fThis.ejecutar("conectado", fResp);
						}
					};
				fConx.onerror	= function(fEv)
					{
						// Funcion ejecutada al producirse Error:
						fThis.ejecutar("error",
							{
								status:
									{
										type	: "error",
										code	: this.status,
										message	: this.statusText,
										detail	: fEv
									}
							}
						);
					};
				let fQuery	= this.queryParams(this.#_params);
				fConx.open(this.#_metodo, this.#_url + (this.#_metodo.toUpperCase() != "POST" && fQuery.length > 0 ? "?" + fQuery.join("&"): ""), true);
				if (this.#_params !== undefined || this.#_metodo.toUpperCase() == "POST")
				{
					fConx.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				}
				fConx.send(fQuery.length > 0 ? fQuery.join("&"): this.#_params);
			}
			else
			{
				this.ejecutar("error", 
					{
						status:
						{
							type	: "error",
							code	: 1,
							message	: "Falta el URL"
						}
					}
				);
			}
		}
		catch (fExc)
		{
			// Funcion ejecutada al producirse Excepcion:
			this.ejecutar("error",
				{
					status:
					{
						type	: "exception", 
						code	: fExc.code, 
						message	: fExc.message, 
						detail	: fExc 
					}
				}
			);
		}
		finally
		{
			this.ejecutar("terminado", {});
		}
		return fConx;
	}
	/*
	---------------------------------------
	@about	Abre Conexion segun el Tipo.
	@author	ccasanova
	@date	24/05/2022
	@return	Object		La conexion realizada.
	*/
	abrir()
	{
		this.depurar("[abrir] Iniciada.", { tipo:this.#_tipo });
		
		switch (this.#_tipo)
		{
			case "websocket":
			{
				this.#_conexion	= this.abrirWebSocket();
				break;
			}
			case "jquery":
			{
				this.#_conexion	= this.abrirJqueryAjax();
				break;
			}
			default:
			{
				this.#_conexion	= this.abrirXMLHttpRequest();
			}
		}
		return this.#_conexion;
	}
}
