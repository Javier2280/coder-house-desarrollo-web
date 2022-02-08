/*
+===========================================================+
|						SECCIÓN OBJETOS						|
+===========================================================+
*/
//Clase que representa un producto usado en la receta y que será convertido en sus cantidades por el cálculo de volúmen.
class Productos {
	constructor() {
		this.nombre = "";
		this.cantidadReceta = 0;
		this.cantidadPreparacion = 0;
		this.uMedida = "";
	}

	agregar(nombre, cantidadReceta, coeficiente, uMedida) {
		let valorConversion = parseFloat(coeficiente);
		let nuevaCantidad = parseFloat(cantidadReceta) * valorConversion.toFixed(2);

		this.nombre = nombre;
		this.cantidadReceta = cantidadReceta;
		this.cantidadPreparacion = nuevaCantidad;
		this.uMedida = uMedida;

		return true;
	}

	//Muestra el texto con los datos de la conversión del producto. Especialmente para ser utilizado en console.log o alert.
	mostrarConversion() {
		return "Información del producto:\nProducto: " + this.nombre + "\nCantidad original: " + this.cantidadReceta + "\nCantidad nueva: " + this.cantidadPreparacion + "\nUnidad de medida: " + this.uMedida
	}

}

//Clase que representa un molde, con toda la información necesaria para los cálculos correspondientes.
class Molde {

    constructor() {
        this.origen = "receta";
        this.forma = "redondo";
        this.altura = 0;
        this.diametro = 0;
        this.ladoA = 0;
        this.ladoB = 0;
        this.volumen = 0;
    }

    //Permite cargar la información de dimensión del molde
    nuevoMolde(origen, forma, altura, diametro, ladoA, ladoB) {
        let radio = 0;
        let base = 0;
        let volumen = 0;

        //Calcula su volumen que luego se utilizará para el coeficiente de reducción o incremento de materiales a utilizar.
        switch(forma) {
            case "redondo":
                radio = (diametro / 2);
                base = (radio * radio * 3.14);
                volumen = (base * altura);
                break;
            case "cuadrado":
                volumen = (ladoA * ladoB * altura);
                break;
            case "rectangular":
                volumen = (ladoA * ladoB * altura);
                break;      
        }

        
        this.origen = origen;
        this.forma = forma;
        this.altura = altura; 
        this.base = base;
        this.diametro = diametro; 
        this.ladoA = ladoA; 
        this.ladoB = ladoB;
        this.volumen = volumen;

        return true;

    }
}

/*
+===============================================================+
|						VARIABLES GLOBALES						|
+===============================================================+
*/
function PrepararObjetos() {
	//Chequeo si existe el dato guardado y lo elimino
	if (localStorage.getItem("receta") != null) {
		//console.log("Quitar molde receta: " + localStorage.getItem("receta"));
		localStorage.removeItem("receta");
	}

	//Chequeo si existe el dato guardado y lo elimino
	if (localStorage.getItem("usuario") != null) {
		//console.log("Quitar molde usuario: " + localStorage.getItem("usuario"));
		localStorage.removeItem("usuario");
	}

	//Chequeo si existe el dato guardado y lo elimino
	if (localStorage.getItem("productos") != null) {
		//console.log("Quitar productos: " + localStorage.getItem("productos"));
		localStorage.removeItem("productos");
	}
}
        
window.onload = PrepararObjetos();

/*
+===============================================================+
|						SECCIÓN FUNCIONES						|
+===============================================================+
*/
//Muestro u oculto los controles de los moldes
function mostrar(selMolde, selForma) {
	let moldes = document.getElementById(selMolde).children;

	for (i = 0; i < moldes.length; i++) {
	  moldes[i].style.display = "none";
	  if(moldes[i].id == selMolde + selForma) {
	  	moldes[i].style.display = "inline";
	  }
	}
}

function habilitarPasos(paso) {
	document.getElementById(paso).style.display = "inline";
}

//Cargo los datos de los moldes
function cargarMolde(origen, forma) {
	let diametro = 0;
	let altura = 0;

	let ladoA = 0;
	let ladoB = 0;

	switch(forma) {
        case "redondo":
            diametro = document.getElementById("diametro" + origen + "Redondo").value;
            altura = document.getElementById("altura" + origen + "Redondo").value;
            break;
        case "cuadrado":
            ladoA = document.getElementById("lado" + origen + "Cuadrado").value;
            ladoB = ladoA;
            altura = document.getElementById("altura" + origen + "Cuadrado").value;
            break;
        case "rectangular":
            ladoA = document.getElementById("lado1" + origen + "Rectangular").value;
            ladoB = document.getElementById("lado2" + origen + "Rectangular").value;
            altura = document.getElementById("altura" + origen + "Rectangular").value;
            break;      
    }

	let miMolde = new Molde();

	if (miMolde.nuevoMolde(origen, forma, altura, diametro, ladoA, ladoB) == true){
		switch(origen) {
	        case "Original":
	        	//console.log("receta: " + JSON.stringify(miMolde));
	            localStorage.setItem("receta",JSON.stringify(miMolde));
	            break;
	        case "Usuario":
	        	//console.log("usuario: " + JSON.stringify(miMolde));
	            localStorage.setItem("usuario",JSON.stringify(miMolde));
	            break;
	    }

	    document.getElementById("mensaje" + origen + forma).innerText = "Datos cargados correctamente!";
	}

	if(origen=='Original') {
		habilitarPasos("dvPaso2");
		habilitarPasos("imgPaso")
	} else {
		habilitarPasos("dvPaso3");
	}
	

}

//Calculo el coeficiente de reducción / aumento de los materiales a utilizar
function coeficiente() {
	//Chequeo si existe el dato guardado y lo elimino
	if (localStorage.getItem("coeficiente") != null) {
		//console.log("coeficiente: " + localStorage.getItem("coeficiente"));
		localStorage.removeItem("coeficiente");
	}

	let moldeUsuario = JSON.parse(localStorage.getItem("usuario"));
	let moldeReceta = JSON.parse(localStorage.getItem("receta"));

//console.log("Usuario.volumen: " + moldeUsuario.volumen);
//console.log("Receta.volumen: " + moldeReceta.volumen);

	multiplicador = (moldeUsuario.volumen / moldeReceta.volumen);
	localStorage.setItem("coeficiente",parseFloat(multiplicador));

	document.getElementById("coeficiente").style.display = "inline";
	document.getElementById("coeficiente").innerHTML = "<br><p>El coeficiente de modificación de cantidad para los productos es: " + multiplicador.toFixed(2) + "</p>" + 
														"<p>Ahora puede seleccionar la opción <i><b>Calcular ingredientes</b></i> que le permitirá armar la lista de los productos de su receta pero con el volumen correcto de acuerdo a su molde.</p>" +
														"<input type='submit' id='calcularIngredientes' value='Calcular ingredientes' class='button1' onclick='mostrarProductos()'>";

}

function mostrarProductos() {
	document.getElementById("producto").style.display = "inline";
}

function cargarProductos() {
	let productos = [];

	//Si ya hay productos guardados los recupero y los cargo en el array
	if (localStorage.getItem("productos") != null) {
		//console.log("productos: " + JSON.parse(localStorage.getItem("productos") || "[]"));
		productos = JSON.parse(localStorage.getItem("productos") || "[]");
	}

	let nombreProducto = document.getElementById("nombreProducto").value;
	let cantidadOriginal = document.getElementById("cantidadProducto").value;
	let coeficiente = localStorage.getItem("coeficiente");
	let uMedida = document.getElementById("uMedida").value;
	let producto = new Productos();
	

	producto.agregar(nombreProducto, cantidadOriginal, coeficiente, uMedida);
	productos.push(producto);

	//console.log("productos: " + JSON.stringify(productos));
	localStorage.setItem("productos",JSON.stringify(productos));

	let registro = "<thead><tr><th>#</th><th>Producto</th><th>Unidad de medida</th><th>Cantidad original</th><th>Cantidad modificada</th></tr></thead><tbody>";

	for(let i = 0; i < productos.length; i++) {
		registro = registro + "<tr><td>" + (i + 1) + "</td><td>" + productos[i].nombre + "</td><td>" + productos[i].cantidadReceta + "</td><td>" 
							+ productos[i].cantidadPreparacion + "</td><td>" + productos[i].uMedida + "</td></tr>";
		

		i++;
	}

	document.getElementById('productos').innerHTML = (registro + "</tbody>");

}