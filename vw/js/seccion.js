/*
-------------------------------------------------------------------------------
@about		Modulo Controlador de Contenido de Seccion.
@author		Carolina Casanova G., Jorge Corvalan C.
@date		27/03/2025
-------------------------------------------------------------------------------
*/

var ccSeccion =
{
	/*
	-----------------------------------
	@about	Objeto de configuracion - Elementos DOM
	*/
	dom		:
	{
		titulo			: null,	// Contenedor de titulo
		contenedor		: null,	// Contenedor de contenido
		templates		: {},	// Plantillas de contenido
	},
	
	/*
	-----------------------------------
	@about	Carga el formulario con los campos de item recibidos.
	@date	27/03/2025
	*/
	cargarForm	: function(response)
	{
		console.log("[cargarForm]", response);
	},
	/*
	-----------------------------------
	@about	Carga en titulo y contenedor de seccion los items recibidos.
	@date	27/03/2025
	*/
	cargar	: function(response)
	{
		// console.log("[cargar]", response);
		try
		{
			if (response != "")
			{
				var data	= JSON.parse(response);
				if (data)
				{
					// console.log(data);
					
					if (data.error === false)
					{
						var items	= data.datos;
						if (items.length > 0)
						{
							var tit		= ccSeccion.dom.titulo;
							var cont	= ccSeccion.dom.contenedor;
							
							// Recupera plantilla de item:
							var temp	= ccSeccion.dom.templates.seccion_item;
							
							// console.log(temp, cont, tit);
							
							if (temp && cont && tit)
							{
								// Asigna titulo:
								tit.innerHTML	= ccMenu.menu.items[items[0].id_seccion].nombre;
								
								// Vacia el contenedor:
								cont.innerHTML	= "";
								
								// Campos a obtener:
								var campos	= ["nombre", "descripcion"];
								
								// Recorre items recibidos:
								for (var f = 0; f < items.length; f++)
								{
									// console.log(f, items[f]);
									
									try
									{
										var tempClon	= temp.content.cloneNode(true);
										var nuevoItem	= tempClon.querySelector('[data-type="item"]');
										
										// console.log(nuevoItem);
										if (nuevoItem)
										{
											// Asigna valores al contenido del item:
											var figure	= nuevoItem.querySelector('[data-type="imagen"]');
											var texto	= nuevoItem.querySelector('[data-type="texto"]');
											
											if (figure && texto)
											{
												// Revisa si item tiene metadatos:
												var meta	= {};
												if (items[f].parametros
													&& items[f].parametros.length > 0)
												{
													// Los memoriza para futuro uso:
													var pars	= items[f].parametros;
													for (var i = 0; i < pars.length; i++)
													{
														meta[pars[i].id_param]	= pars[i].valor;
													}
												}
												
												// Sector Imagen:

												// - Averigua si hay una imagen asociada:
												if (meta.url_portada
													&& meta.url_portada != "")
												{
													figure.style.backgroundImage	= 'url("' + meta.url_portada + '")';
													figure.querySelector("IMG").src	= meta.url_portada;
													
													if (meta.url_portada.toLowerCase().indexOf(".png") > -1)
													{
														figure.classList.add("icon");
													}
												}
												
												// Sector Texto:

												// - Asigna nombre:
												var f_nombre	= texto.querySelector('[data-field="nombre"]');
												if (f_nombre
													&& items[f].nombre != undefined)
												{
													f_nombre.innerHTML	= items[f].nombre;
												}

												// - Busca campos extra (metadatos):
												
												// -- Metadato Descripcion:
												var f_descripcion	= texto.querySelector('[data-field="descripcion"]');
												if (f_descripcion
													&& meta.descripcion 
													&& meta.descripcion != "")
												{
													f_descripcion.innerHTML	= meta.descripcion.replace("\n", '<br/>');
												}
												// -- Metadato URL:
												var f_url	= texto.querySelector('[data-field="url"]');
												if (f_url)
												{
													if (meta.url && meta.url != "")
													{
														f_url.querySelector('A').href	= meta.url;
													}
													else
													{
														// Remueve el vinculo de plantilla:
														texto.removeChild(f_url);
													}
												}

												// Item por medio alterna la posicion de la imagen respecto al texto:
												if (f % 2 != 0)
												{
													nuevoItem.classList.add("reverso");
												}
												
												// Agrega el item al contenedor:
												cont.appendChild(nuevoItem);
												
												// En caso de que el item tenga hijos:
												if (items[f].tiene_hijos != undefined
													&& items[f].tiene_hijos)
												{
													// Inicia el contenedor para los hijos a partir de plantilla:
													var tempHijos;
													if (items[0].id_tipo == "form")
													{
														tempHijos	= ccSeccion.dom.templates.seccion_form;
													}
													else
													{
														tempHijos	= ccSeccion.dom.templates.seccion_hijos;
													}
													
													if (tempHijos)
													{
														var tempHijosClon	= tempHijos.content.cloneNode(true);
														var contHijos		= tempHijosClon.querySelector('[data-type="item"]');
														
														if (contHijos)
														{
															// Lo oculta mientras se solicitan y cargan sus valores:
															// contHijos.classList.add("oculta");
															
															// Lo agrega a continuacion del item padre:
															cont.appendChild(contHijos);
														}
														
														// Si es tipo "form", solicita los campos de formulario del item;
														// De lo contrario, solicita los hijos para mostrarlos como galeria.
														ccSeccion.solicitar(
															items[0].id_seccion, 
															items[0].id_item, 
															items[0].id_tipo);
													}
												}
											}
										}
									}
									catch (exc2)
									{
										console.log(f, exc2);
									}
								}
							}
						}
					}
					else
					{
						ccRequest.mensaje.mostrar("resultado", "error", data.error);
					}
				}
			}
		}
		catch (exc)
		{
			console.log("x Error:", exc);
		}
	},
	/*
	-----------------------------------
	@about	Solicita los items de la seccion al servidor.
	@date	27/03/2025
	*/
	solicitar	: function(id, id_item_padre, id_tipo)
	{
		try
		{
			if (id && id != "")
			{
				console.log("[solicitar]", id, id_item_padre, id_tipo);
				
				id_item_padre	= (id_item_padre == undefined ? 0: id_item_padre);
				var callback	= (id_tipo != undefined && id_tipo != "" ? (id_tipo == "form" ? ccSeccion.cargarForm: ccSeccion.cargarHijos): ccSeccion.cargar);
				var params		= { 
						entidad			:"item_seccion", 
						id_seccion		:id, 
						"id_item_padre"	:id_item_padre
					};
				console.log(params);
				ccRequest.solicitar(params, callback);
			}
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
	@require	request.js
	*/
	inicializar	: function()
	{
		// console.log("[inicializar]");
		
		// Identifica y memoriza los elementos DOM asociados a este controlador:
		
		// - Titulo de Seccion:
		var tit	= document.querySelector('MAIN [data-id="titulo"]');
		if (tit)
		{
			ccSeccion.dom.titulo	= tit;
		}
		// - Contenedor de Seccion.
		var cont	= document.querySelector('MAIN [data-id="contenido"]');
		if (cont)
		{
			ccSeccion.dom.contenedor	= cont;
		}
		
		// - Plantillas de contenido de Seccion:
		var temps_id	= ["seccion_item", "seccion_hijos", "seccion_form"];
		for (var f = 0; f < temps_id.length; f++)
		{
			var id		= temps_id[f];
			var temp	= document.querySelector('TEMPLATE[data-id="' + id + '"]');
			if (temp)
			{
				ccSeccion.dom.templates[id]	= temp;
			}
		}
	},
};
