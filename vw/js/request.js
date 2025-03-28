/*
-------------------------------------------------------------------------------
@about		Modulo Controlador - Solicitudes a Servidor.
@author		Carolina Casanova G., Jorge Corvalan C.
@date		27/03/2025
@require	class.qasinc.js
-------------------------------------------------------------------------------
*/

var ccRequest	= 
{
	/*
	-----------------------------------
	@about	Objeto de configuracion - Elementos DOM
	*/
	dom	:
	{
		msjes	: { carga:null, resultado:null, },
	},
	
	/*
	-----------------------------------
	@about	Controlador de callbacks por defecto.
	*/
	callbacks	:
	{
		/*
		-----------------------------------
		@about	Muestra mensaje de espera.
		@date	27/03/2025
		*/
		iniciado	: function()
		{
			ccRequest.mensaje.mostrar("carga");
		},
		/*
		-----------------------------------
		@about	Recibe el resultado del servidor, maneja errores y ejecuta la callback de usuario, si la hay.
		@date	27/03/2025
		*/
		conectado	: function(response, params)
		{
			try
			{
				// console.log("[conectado]", response, params);
				
				// Verifica errores:
				if (response.status.type != "ok")
				{
					ccRequest.mensaje.mostrar("resultado", "error", response.status.message);
				}
				else
				{
					// Si hay un callback definido, lo ejecuta:
					if (params.callback)
					{
						params.callback(response.response);
					}
				}
			}
			catch (exc)
			{
				console.log("x Error:", exc);
			}
			ccRequest.callbacks.terminado();
		},
		/*
		-----------------------------------
		@about	Muestra mensaje de error.
		@date	27/03/2025
		*/
		error	: function(response)
		{
			ccRequest.mensaje.mostrar("resultado", "error", response);
		},
		/*
		-----------------------------------
		@about	Oculta mensaje de espera.
		@date	27/03/2025
		*/
		terminado	: function()
		{
			ccRequest.mensaje.ocultar("carga");
		},
	},
	/*
	-----------------------------------
	@about	Controlador de eventos sobre mensajes al usuario.
	*/
	mensaje	:
	{
		/*
		-----------------------------------
		@about	Muestra mensaje especificado.
		@date	27/03/2025
		@param	id		String	Identificador del contenedor de mensaje
		@param	tipo	String	Valores: "error", "exito", ""(defecto)
		@param	texto	String	Opcional. Contenido del mensaje.
		*/
		mostrar	: function(id, tipo, texto)
		{
			if (id != "" && ccRequest.dom.msjes[id])
			{
				ccRequest.dom.msjes[id].classList.remove("oculta");
				if (tipo && tipo != "")
				{
					ccRequest.dom.msjes[id].classList.add(tipo);
				}
				if (texto && texto != "")
				{
					ccRequest.dom.msjes[id].innerHTML	= '<p>' + texto + '</p>';
				}
			}
		},
		/*
		-----------------------------------
		@about	Oculta mensaje especificado.
		@date	27/03/2025
		*/
		ocultar	: function(id)
		{
			if (id != "" && ccRequest.dom.msjes[id])
			{
				ccRequest.dom.msjes[id].classList.add("oculta");
			}
		},
	},
	
	/*
	-----------------------------------
	@about	Envia solicitud de datos a servidor.
	@date	27/03/2025
	*/
	solicitar	: function(params, callback)
	{
		try
		{
			// console.log("[solicitar]", params, callback);
			var conx	= new QAsinc("req.php", 0, params);
			conx.setCallback("iniciado", ccRequest.callbacks.iniciado);
			conx.setCallback("error", function(resp) 
				{
					ccRequest.callbacks.error(resp.error);
				}
			);
			var paramsCon	= {};
			if (params)
			{
				paramsCon	= Object.assign(paramsCon, params);
			}
			if (callback)
			{
				paramsCon["callback"]	= callback;
			}
			conx.setCallback("conectado", ccRequest.callbacks.conectado, paramsCon); 
			conx.abrir();
		}
		catch (exc)
		{
			console.log("x Error:", exc);
		}
	},

	/*
	-----------------------------------
	@about	Tareas al terminar la carga del DOM
	@date	27/03/2025
	*/
	inicializar	: function()
	{
		// console.log("[inicializar]");
		var msjes	= document.querySelectorAll('[data-type="mensaje_request"]');
		if (msjes.length > 0)
		{
			// console.log(msjes);
			
			msjes.forEach(function(msje)
				{
					var id	= msje.dataset.id;
					
					// Asigna manejador de evento click:
					msje.addEventListener("click", function(event)
						{
							ccRequest.mensaje.ocultar(id);
						}
					);
					// Memoriza los contenedores:
					ccRequest.dom.msjes[id]	= msje;
					
					// Oculta el mensaje:
					ccRequest.mensaje.ocultar(id);
					
					// console.log(msje.className);
				}
			);
		}
	},
};