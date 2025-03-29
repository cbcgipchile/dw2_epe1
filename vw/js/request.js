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
		msje	: null,
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
					ccRequest.mensaje.mostrar("error", response.status.message);
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
			ccRequest.mensaje.mostrar("error", response);
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
		@param	tipo	String	Valores: "error", "exito", "carga", ""(defecto)
		@param	texto	String	Opcional. Contenido del mensaje.
		*/
		mostrar	: function(tipo, texto)
		{
			if (ccRequest.dom.msje)
			{
				ccRequest.dom.msje.className	= "mensaje oculta";
				if (tipo && tipo != "")
				{
					ccRequest.dom.msje.classList.add(tipo);
				}
				texto	= (tipo == "carga" ? "Espere, por favor...": texto);
				ccRequest.dom.msje.innerHTML	= '<p>' + texto + '</p>';
				ccRequest.dom.msje.classList.remove("oculta");
			}
		},
		/*
		-----------------------------------
		@about	Oculta mensaje especificado.
		@date	27/03/2025
		*/
		ocultar	: function()
		{
			if (ccRequest.dom.msje)
			{
				ccRequest.dom.msje.classList.add("oculta");
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
			var conx	= new QAsinc("req.php", 0, params, "POST");
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
		var msje	= document.querySelector('[data-type="mensaje_request"]');
		if (msje)
		{
			// console.log(msje);
			
			var id	= msje.dataset.id;
			
			// Asigna manejador de evento click:
			msje.addEventListener("click", function(event)
				{
					ccRequest.mensaje.ocultar();
				}
			);
			// Memoriza los contenedores:
			ccRequest.dom.msje	= msje;
			
			// Oculta el mensaje:
			ccRequest.mensaje.ocultar();
			
			// console.log(msje.className);
		}
	},
};