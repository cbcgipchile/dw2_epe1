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
	
	form	:
	{
		enviar	: function(event)
		{
			event.preventDefault();
			console.log("[enviar]", event);
			
			return false;
		},
	},
	
	/*
	-----------------------------------
	@about	Carga galeria de items hijos de otro item.
	@date	27/03/2025
	*/
	cargarHijos	: function(response)
	{
		console.log("[cargarHijos]", response);
	},
	/*
	-----------------------------------
	@about	Carga el formulario con los campos de item recibidos.
	@date	27/03/2025
	*/
	cargarForm	: function(response)
	{
		// console.log("[cargarForm]", response);
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
							// console.log(items);
							
							var id_item_padre	= items[0].id_item_padre;
							
							// 1. Busca el contenedor de form del item padre:
							var contSec	= ccSeccion.dom.contenedor || document.querySelector('MAIN > [data-id="contenido"]');
							var contForm	= contSec.querySelector('[data-type="item_form"][data-id="' + id_item_padre + '"]');
							var cont		= contForm.querySelector('[data-type="fields"]');
							
							// console.log(id_item_padre, cont);
							
							if (cont)
							{
								// Obtiene los contenedores de campo segun su tipo:
								var tempFields	= cont.querySelectorAll('.field');
								var tempCampos	= {};
								if (tempFields.length)
								{
									tempFields.forEach(function(elem)
										{
											tempCampos[elem.dataset.type]	= elem.cloneNode(true);
										}
									);
								}
								
								// console.log(tempCampos);
								
								// Si hay plantillas de tipos de campo:
								if (Object.keys(tempCampos).length > 0)
								{
									// Limpia el contenedor de campos:
									cont.innerHTML	= "";
									
									// 2. Recorre items recibidos:
									for (var f = 0; f < items.length; f++)
									{
										// console.log(f, items[f]);
										try
										{
											// Obtiene metadatos:
											var params	= {};
											for (var p = 0; p < items[f].parametros.length; p++)
											{
												var key	= items[f].parametros[p].id_param;
												if (key.substr(0, 6) == "field_")
												{
													params[key]	= items[f].parametros[p].valor;
												}
											}
											// console.log(params);
											
											// var tempClon	= tempCampos[params.field_type].cloneNode(true);
											var nuevoItem	= tempCampos[params.field_type].cloneNode(true);
											
											// console.log(nuevoItem);
											if (nuevoItem)
											{
												nuevoItem.dataset.id	= items[f].id_item;
												
												var idControl	= "item_form_" + id_item_padre + "_" + items[f].id_item;
												
												var label	= nuevoItem.querySelector('LABEL');
												label.querySelector('SPAN').innerHTML	= items[f].nombre;
												label.setAttribute("for", idControl);
												
												var control	= nuevoItem.querySelector('[data-type="control"]');
												control.id	= idControl;
												if (params.field_required)
												{
													control.setAttribute("required", true);
												}
												else
												{
													label.removeChild(label.querySelector(".required"));
												}
												
												cont.appendChild(nuevoItem);
												// console.log(nuevoItem);
											}
										}									
										catch (exc2)
										{
											console.log(f, exc2);
										}
									} // ---Fin For Items---
									
									// Aplica manejador de Envio de formulario:
									contForm.querySelector("FORM").addEventListener("submit", ccSeccion.form.enviar);
									
									contForm.classList.remove("oculta");
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
								
								// Recorre items recibidos:
								for (var f = 0; f < items.length; f++)
								{
									// console.log(f, items[f]);
									try
									{
										var tempClon	= temp.content.cloneNode(true);
										var nuevoItem	= tempClon.querySelector('[data-type="item_padre"]');
										
										// console.log(items[f], nuevoItem);
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
												var urlImg	= "./vw/img/icon_solution.png";
												if (meta.url_portada
													&& meta.url_portada != "")
												{
													urlImg	= meta.url_portada;
												}
												figure.querySelector(".imagen").style.backgroundImage	= 'url("' + urlImg + '")';
												figure.querySelector("IMG").src	= urlImg;
												
												if (urlImg.toLowerCase().indexOf(".png") > -1)
												{
													figure.classList.add("icon");
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
													if (meta.url_value 
														&& meta.url_value != "")
													{
														var f_url_link	= f_url.querySelector('A');
														if (f_url_link)
														{
															f_url_link.href	= meta.url_value;
														
															if (meta.url_text 
																&& meta.url_text != "")
															{
																f_url_link.title		= meta.url_text;
																f_url_link.innerHTML	= meta.url_text;
															}
															if (meta.url_target)
															{
																f_url_link.target		= meta.url_target;
															}
														}
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
												
												// console.log(f, nuevoItem, cont, cont.innerHTML);
												
												// En caso de que el item tenga hijos:
												if (items[f].tiene_hijos != undefined
													&& items[f].tiene_hijos)
												{
													// Inicia el contenedor para los hijos a partir de plantilla:
													var tempHijos;
													var tipoHijo	= "hijos";
													if (items[0].id_tipo == "form")
													{
														tempHijos	= ccSeccion.dom.templates.seccion_form;
														tipoHijo	= "form";
													}
													else
													{
														tempHijos	= ccSeccion.dom.templates.seccion_hijos;
													}
													
													if (tempHijos)
													{
														var tempHijosClon	= tempHijos.content.cloneNode(true);
														var contHijos		= tempHijosClon.querySelector('[data-type="item_' + tipoHijo + '"]');
														
														// console.log(contHijos);
														
														if (contHijos)
														{
															contHijos.dataset.id	= items[f].id_item;
															// Lo oculta mientras se solicitan y cargan sus valores:
															contHijos.classList.add("oculta");
															
															// Lo agrega a continuacion del item padre:
															cont.appendChild(contHijos);
															
															// console.log(contHijos, cont, cont.innerHTML);
														
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
									}
									catch (exc2)
									{
										console.log(f, exc2);
									}
								} // ---Fin For Items---
								
								cont.classList.remove("carga");
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
				// console.log("[solicitar]", id, id_item_padre, id_tipo);
				
				// Refresca area de contenido:
				var titulo	= ccMenu.menu.items[id].nombre;
				if (titulo)
				{
					ccSeccion.dom.titulo.innerHTML	= titulo;
					ccSeccion.dom.contenedor.classList.add("carga");
					// ccSeccion.dom.contenedor.innerHTML	= "";
				}
				
				// Valores por defecto, si no vienen por parametro:
				id_item_padre	= (id_item_padre == undefined ? 0: id_item_padre);
				var callback	= (id_tipo != undefined && id_tipo != "" ? (id_tipo == "form" ? ccSeccion.cargarForm: ccSeccion.cargarHijos): ccSeccion.cargar);
				
				// Parametros a enviar a solicitud:
				var params		= { 
						entidad			:"item_seccion", 
						id_seccion		:id, 
						"id_item_padre"	:id_item_padre
					};
				// console.log(params);
				// Solicitud enviada:
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
