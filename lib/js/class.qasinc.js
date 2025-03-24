/*
-------------------------------------------------------------------------------
@about	CLASE Manejador de Llamada Asincrona.
@author	Carolina Casanova G.
@date	21/04/2023
@update	28/07/2024 ccasanova: Agregado metodo setDebug.
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
	
	#_tipo		= "xmlhttprequest";	// Otros valores: "websocket", "jquery"
	#_url		= "";
	#_puerto	= 0;
	#_params	= undefined;		// Objeto plano a enviar durante la conexion.
	#_metodo	= "GET";			// Otros valores: "POST".
	
	#_tipos		= ["xmlhttprequest", "websocket", "jquery"];
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
	constructor(fTipo, fUrl, fPuerto, fParams, fMetodo)
	{
		this.#_tipo		= fTipo;
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
	@about	Abre Conexion Ajax via JQuery y define su manejo de eventos.
	@author	ccasanova
	@date	25/05/2022
	@require	JQuery
	@return		Object	La conexion realizada.
	*/
	abrirJqueryAjax()
	{
		var fConx;
		
		if (this.#_url != "")
		{
			var fThis	= this;
			// Settings:
			let fOpciones	= 
				{
					// Funcion a ejecutar en caso de Error:
					"error"		: function(fXHR, fStatus, fError) 
						{
							fThis.ejecutar("error",
								{
									status		:
									{
										type	: "error",
										code	: fStatus,
										message	: fError,
										detail	: fXHR 
									}
								}
							);
						}
				};
			// Parametros a Enviar en la Conexion:
			if (this.#_params !== undefined)
			{
				fOpciones["data"]	= this.#_params;
			}
			// Funcion a ejecutar en caso de Exito:
			fOpciones["success"]	= function(fData, fStatus, fXHR)
				{
					let fResp	= 
						{
							response	: fData,
							status		:
							{
								type	: "ok",
								code	: fStatus,
								message	: "Respuesta Recibida",
								detail	: fXHR 
							}
						};
					fThis.ejecutar("conectado", fResp);
				};
			// Funcion a ejecutar previo a Conectar:
			fOpciones["beforeSend"]	= function(fXHR, fSettings)
				{
					fThis.ejecutar("iniciado",
						{
							status		:
							{
								type	: "ok",
								code	: false,
								message	: "Iniciando Conexion",
								detail	: { xhr:fXHR, settings:fSettings } 
							}
						}
					);
				};
			// Funcion a ejecutar al Terminar todo:
			fOpciones["complete"]	= function(fXHR, fTextStatus)
				{
					fThis.ejecutar("terminado", 
						{
							status		:
							{
								type	: "ok",
								code	: false,
								message	: fTextStatus,
								detail	: fXHR 
							}
							
						}
					);
				};
			
			// Abre URL para obtener sus datos:
			fConx	= jQuery.ajax(this.#_url, fOpciones);
		}
		return fConx;
	}
	/*
	---------------------------------------
	@about	Abre Conexion WebSocket y define su manejo de eventos.
	@author	ccasanova
	@date	25/05/2022
	@update	25/07/2024 ccasanova: Ahora el puerto es opcional.
	@update	28/07/2024 ccasanova: Encerrado el codigo en bloque TRY...CATCH.
	@return	Object		La conexion realizada.
	*/
	abrirWebSocket()
	{
		var fConx;
		
		try
		{
			if (this.#_url != "")
			{
				var fThis	= this;
				let fUrl	= this.#_url + (this.#_puerto > 0 ? ":" + this.#_puerto: "");
				
				// Abre Conexion:
				fConx	= new WebSocket(fUrl);
				
				if (fConx)
				{
					// Manejo de Eventos:
					
					// Caso de Error:
					fConx.addEventListener('error', function (fEvent) 
						{
							fThis.ejecutar("error", 
								{
									status:
									{
										type	: "error",
										code	: 1,
										message	: "Error",
										detail	: fEvent 
									}
								}
							);
						}
					);
					// Caso de Exito: Conexion Abierta
					fConx.addEventListener('open', function (fEvent) 
						{
							// fConx.send('Hello Server');
							fThis.ejecutar("iniciado", 
								{
									status:
									{
										type	: "ok",
										code	: fEvent.status,
										message	: "Conexion Establecida",
										detail	: fEvent 
									}
								}
							);
						}
					);
					// Caso Mensaje Recibido:
					fConx.addEventListener('message', function (fEvent) 
						{
							let fResp	=
								{
									response	: fEvent.data,
									status		:
									{
										type	: "ok",
										code	: fEvent.status,
										message	: "Mensaje Recibido",
										detail	: fEvent 
									}
								};
							fThis.ejecutar("conectado", fResp);
						}
					);
					// Caso Conexion Terminada:
					fConx.addEventListener('close', function (fEvent) 
						{
							fThis.ejecutar("terminado", 
								{
									status		:
									{
										type	: "ok",
										code	: fEvent.status,
										message	: "Conexion Finalizada",
										detail	: fEvent 
									}
								}
							);
						}
					);
				}
				else
				{
					// *ERROR
					console.log("Error: ", fConx);
				}
			}
		}
		catch(fExc)
		{
			console.log(fExc);
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

	/*
	---------------------------------------
	@about	Solo Conexion Tipo Websocket: Envia Mensaje al Servidor mediante Conexion.
	@author	ccasanova
	@date	24/05/2022
	@return	void
	*/
	enviarMensaje(fMsje)
	{
		this.depurar("[enviarMensaje] Iniciada.");
		
		if (this.#_tipo == "websocket"
			&& this.#_conexion != undefined
			&& this.#_conexion != null
			&& this.#_conexion.readyState != undefined
			&& this.#_conexion.readyState == 1
			&& fMsje != undefined
			&& fMsje != "")
		{
			this.depurar("[enviarMensaje] Enviando mensaje...", { mensaje:fMsje });
			this.#_conexion.send(fMsje);
		}
		else
		{
			this.depurar("[enviarMensaje] No se pudo enviar mensaje.", { "this":this, mensaje:fMsje });
		}
	}
	/*
	---------------------------------------
	@about	Solo Conexion Tipo Websocket: Cierra Conexion.
	@author	ccasanova
	@date	24/05/2022
	@return	void
	*/
	cerrar()
	{
		this.depurar("[cerrar] Iniciada.", { conexion:this.#_conexion });

		if (this.#_conexion != undefined
			&& this.#_conexion != null
			&& typeof this.#_conexion.close === "function")
		{
			this.#_conexion.close();
		}
	}
}
