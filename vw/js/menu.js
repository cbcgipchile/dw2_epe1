/*
-------------------------------------------------------------------------------
@about		Modulo Controlador de la Navegacion
@author		Carolina Casanova G., Jorge Corvalan C.
@date		27/03/2025
-------------------------------------------------------------------------------
*/

var ccMenu =
{
	/*
	-----------------------------------
	@about	Objeto de configuracion - Elementos DOM
	*/
	dom		:
	{
		nav		: null,	// Contenedor menu superior
		menus	: {},	// Contenedores items en menus
		item_template	: null,	// Plantilla de item de menu
	},
	/*
	-----------------------------------
	@about	Objeto controlador de menu.
	*/
	menu	:
	{
		items	: {},	// Almacena en memoria la lista de items de menu.
		actual	: "",	// ID Seccion activa.

		/*
		-----------------------------------
		@about	Retorna seccion que esta activa actualmente.
		@date	28/03/2025
		@return	string
		*/
		obtenerActual	: function()
		{
			var id	= "";
			try
			{
				// 1. Busca la seccion en el URL de la ventana:
				var query	= new URLSearchParams(window.location.search);
				// console.log(query, query.size, query.entries);
				if (query.size > 0)
				{
					var f = 0;
					for (var par of query.entries())
					{
						if (f > 0)
						{	break;	}
						id	= par[0];
						f++;
					}
				}
				// 2. Busca la seccion a partir del item de menu activo:
				if (id == "")
				{
					var itemSel	= document.querySelector('[data-type="menu"] [data-type="item"].activada');
					if (itemSel)
					{
						id	= itemSel.dataset.id;
					}
				}
				// 3. Si no encontro la seccion, usa el valor por defecto:
				if (id == "")
				{
					id	= "home";
				}
				// 4. Destaca la seccion encontrada:
				
			}
			catch (exc)
			{
				console.log("x Error:", exc);
			}
			return id;
		},
		/*
		-----------------------------------
		@about	Destaca item de menu NAV especificado por su id.
		@date	28/03/2025
		@return	id	string ID Seccion
		*/
		destacar	: function(id)
		{
			try
			{
				if (id && id != "")
				{
					// Tareas para destacar al item actual:
					var items	= ccMenu.dom.nav.querySelectorAll('[data-type="menu"] [data-type="item"]');
					if (items.length > 0)
					{
						items.forEach(function(itm)
							{
								// Destaca el menu clicado:
								if (itm.dataset.id == id)
								{
									itm.classList.add("activada");
								}
								// Desmarca todos los otros items de menu:
								else
								{
									itm.classList.remove("activada");
								}
							}
						);
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
		@about	Muestra/Oculta el menu (solo pantallas chicas)
		@date	27/03/2025
		*/
		alternar	: function()
		{
			try
			{
				// console.log("[alternar]");
				var cont	= ccMenu.dom.nav;
				if (cont.classList.contains("visible"))
				{
					cont.classList.remove("visible");
					cont.classList.add("oculta");
				}
				else
				{
					cont.classList.add("visible");
					cont.classList.remove("oculta");
				}
			}
			catch (exc)
			{
				console.log("x Error:", exc);
			}
		},
		/*
		-----------------------------------
		@about	Carga la lista de items en los menus del DOM.
		@date	27/03/2025
		*/
		cargar	: function(response)
		{
			try
			{
				// console.log("[cargar]", response);
				
				// Si hay contenedores de menu en DOM
				// y se recibieron datos validos a cargar:
				var menus	= ccMenu.dom.menus;
				if (menus
					&& Object.keys(menus).length > 0
					&& response)
				{
					var data	= JSON.parse(response)
					if (data)
					{
						var items	= data.datos;
						if (items.length > 0)
						{
							// console.log(items, menus);

							// Obtiene plantilla de item:
							var temp	= ccMenu.dom.item_template;
							if (temp)
							{
								for (var id in menus)
								{
									var cont	= menus[id];
									if (cont)
									{
										// Vacia el contenedor:
										cont.innerHTML	= "";

										// Recorre los valores recibidos:
										for (var f = 0; f < items.length; f++)
										{
											// Memoriza el item:
											ccMenu.menu.items[items[f].id_seccion]	= items[f];
											
											try
											{
												var tempClon	= temp.content.cloneNode(true);
												var nuevoItem	= tempClon.querySelector('[data-type="item"]');
												
												// console.log(nuevoItem);
												
												if (nuevoItem)
												{
													// Asigna valores al item:
													var item_id	= items[f].id_seccion;
													nuevoItem.dataset.id	= item_id;
													var link	= nuevoItem.querySelector("A");
													link.dataset.id	= item_id;
													link.href		= "./?" + item_id;
													link.innerHTML	= items[f].nombre;
													
													// Asigna manejador de eventos:
													link.addEventListener("click", ccMenu.menu.ir);
													
													// Agrega el item al contenedor:
													cont.appendChild(nuevoItem);
												}
											}
											catch (exc2)
											{
												console.log(f, exc2);
											}
										}
									}
								}
								// Solicita la info de la seccion de Inicio:
								ccMenu.menu.actual	= ccMenu.menu.obtenerActual();
								ccMenu.menu.destacar(ccMenu.menu.actual);
								ccSeccion.solicitar(ccMenu.menu.actual);
							}
						}
					}
				}
				else
				{
					if (response.error !== false)
					{
						console.log("x Error en respuesta recibida:", response.error);
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
		@about	Solicita la lista de items del menu clicado.
		@date	27/03/2025
		*/
		ir : function(event)
		{
			event.preventDefault();
			try
			{
				var item	= event.target;
				var id		= item.dataset.id;
				if (id && id != "")
				{
					window.history.pushState({}, "", item.href);
					
					// Destaca el menu clicado:
					ccMenu.menu.destacar(id);
					
					// Oculta el menu (si es desplegable):
					var menuCont	= item.closest('[data-type="menu"]').parentElement;
					if (menuCont.nodeName.toUpperCase() == "NAV"
						&& menuCont.classList.contains("visible"))
					{
						ccMenu.menu.alternar();
					}
					
					// Solicita los datos de la seccion asociada:
					ccSeccion.solicitar(id);
				}
			}
			catch (exc)
			{
				console.log("x Error:", exc);
			}
			return false;
		}
	},
	/*
	-----------------------------------
	@about	Objeto controlador de boton que muestra/oculta menu.
	*/
	boton	:
	{
		click	: function(event)
		{
			// console.log("[click]");
			try
			{
				var btn	= event.target;
				if (btn && btn.dataset.id == "menu_btn")
				{
					ccMenu.menu.alternar();
				}
			}
			catch (exc)
			{
				console.log("x Error:", exc);
			}
		},
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
		
		// - Botones que muestran u ocultan el menu.
		var btns	= document.querySelectorAll('[data-id="menu_btn"]');
		if (btns.length > 0)
		{
			// console.log(btns);
			btns.forEach(function(btn)
				{
					// Asigna manejador de click:
					btn.addEventListener("click", ccMenu.boton.click);
				}
			);
		}
		// - Contenedor de menu superior.
		var nav	= document.querySelector('NAV');
		if (nav)
		{
			ccMenu.dom.nav	= nav;
		}
		// - Contenedor de items de menu:
		var menus	= document.querySelectorAll('[data-type="menu"]');
		if (menus.length > 0)
		{
			// Memoriza contenedor:
			menus.forEach(function(menu)
				{
					ccMenu.dom.menus[menu.dataset.id]	= menu;
				}
			);
			// Envia la solicitud para obtener los items del menu:
			ccRequest.solicitar({ entidad:"seccion" }, ccMenu.menu.cargar);
		}
		// - Plantilla de Item de menu:
		var temp	= document.querySelector('TEMPLATE[data-id="menu_item"]');
		if (temp)
		{
			ccMenu.dom.item_template	= temp;
		}
	},
};