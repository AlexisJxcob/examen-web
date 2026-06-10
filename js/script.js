
// Array global que almacena todos los empleados registrados
let listaEmpleados = [];

// Referencia al modal de Bootstrap 
let modalConfirmacion;

// INICIO: Se ejecuta cuando la página carga

window.onload = function () {
    // Inicializar el componente modal de Bootstrap
    modalConfirmacion = new bootstrap.Modal(document.getElementById("modalConfirmacion"));

    // Mostrar la grilla en su estado inicial (vacía)
    actualizarGrilla();
};


// FUNCIONES DE VALIDACIÓN


// Verifica si el correo tiene un formato válido


// Retorna: true si el formato es correcto y false si no

function correoEsValido(correo) {
    let valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return valid.test(correo);
}


// Verifica si el correo ya existe en la lista de empleados
// Retorna: true si el correo ya está registrado, false si no

function correoExisteEnLista(correo) {
    for (let i = 0; i < listaEmpleados.length; i++) {
        if (listaEmpleados[i].correo.toLowerCase() === correo.toLowerCase()) {
            return true;
        }
    }
    return false;
}


// Verifica que el empleado tenga al menos 18 años en la fecha de ingreso
// Retorna: true si la fecha es válida, false si el empleado sería menor de edad

function edadValidaAlIngresar(fechaNacimiento, fechaIngreso) {
    let nacimiento = new Date(fechaNacimiento);
    let ingreso    = new Date(fechaIngreso);

    // La fecha mínima de ingreso es nacimiento + 18 años
    let fechaMinima = new Date(nacimiento);
    fechaMinima.setFullYear(fechaMinima.getFullYear() + 18);

    return ingreso >= fechaMinima;
}


// Muestra un mensaje de error debajo de un campo

function mostrarError(idCampo, idError, mensaje) {
    let campo     = document.getElementById(idCampo);
    let spanError = document.getElementById(idError);

    // Agregar clase visual de error y quitar la de válido
    campo.classList.add("campo-con-error");
    campo.classList.remove("campo-valido");

    // Mostrar el mensaje de error
    spanError.textContent = mensaje;
}

// Limpia todos los errores del formulario

function limpiarErrores() {
    let idsCampos = ["nombre", "apellido", "fecha-nacimiento", "correo", "cargo", "fecha-ingreso"];
    let idsErrores = ["error-nombre", "error-apellido", "error-nacimiento", "error-correo", "error-cargo", "error-ingreso"];

    for (let i = 0; i < idsCampos.length; i++) {
        document.getElementById(idsCampos[i]).classList.remove("campo-con-error", "campo-valido");
        document.getElementById(idsErrores[i]).textContent = "";
    }
}

// Valida todos los campos del formulario
// Retorna: true si no hay errores, false si hay al menos uno

function validarFormulario() {
    // Limpiar errores anteriores antes de volver a validar
    limpiarErrores();

    let esValido = true;

    // Leer los valores actuales de cada campo
    let nombre          = document.getElementById("nombre").value.trim();
    let apellido        = document.getElementById("apellido").value.trim();
    let fechaNacimiento = document.getElementById("fecha-nacimiento").value;
    let correo          = document.getElementById("correo").value.trim();
    let cargo           = document.getElementById("cargo").value;
    let fechaIngreso    = document.getElementById("fecha-ingreso").value;

    // Validación: Nombre
    if (nombre === "") {
        mostrarError("nombre", "error-nombre", "El nombre es obligatorio.");
        esValido = false;
    }

    // Validación: Apellido
    if (apellido === "") {
        mostrarError("apellido", "error-apellido", "El apellido es obligatorio.");
        esValido = false;
    }

    // Validación: Fecha de Nacimiento
    if (fechaNacimiento === "") {
        mostrarError("fecha-nacimiento", "error-nacimiento", "Ingrese la fecha de nacimiento.");
        esValido = false;
    }

    // Validación: Correo
    if (correo === "") {
        mostrarError("correo", "error-correo", "El correo electrónico es obligatorio.");
        esValido = false;
    } else if (!correoEsValido(correo)) {
        mostrarError("correo", "error-correo", "El formato del correo no es válido.");
        esValido = false;
    } else if (correoExisteEnLista(correo)) {
        mostrarError("correo", "error-correo", "Este correo ya está registrado en el sistema.");
        esValido = false;
    }

    // Validación: Cargo
    if (cargo === "") {
        mostrarError("cargo", "error-cargo", "Debe seleccionar un cargo.");
        esValido = false;
    }

    // Validación: Fecha de Ingreso y edad mínima de 18 años
    if (fechaIngreso === "") {
        mostrarError("fecha-ingreso", "error-ingreso", "Ingrese la fecha de ingreso.");
        esValido = false;
    } else if (fechaNacimiento !== "" && !edadValidaAlIngresar(fechaNacimiento, fechaIngreso)) {
        mostrarError("fecha-ingreso", "error-ingreso", "El empleado debe tener mínimo 18 años al momento de ingresar.");
        esValido = false;
    }

    return esValido;
}


// MANEJO DEL FORMULARIO Y MODAL


// Abre el modal de confirmación solo si el formulario es válido
// Esta función se llama desde el onclick del botón del formulario

function abrirModalConfirmacion() {
    // Si hay errores de validación, no abrir el modal
    if (!validarFormulario()) {
        return;
    }

    // Leer los datos para mostrar el resumen en el modal
    let nombre          = document.getElementById("nombre").value.trim();
    let apellido        = document.getElementById("apellido").value.trim();
    let fechaNacimiento = document.getElementById("fecha-nacimiento").value;
    let correo          = document.getElementById("correo").value.trim();
    let cargo           = document.getElementById("cargo").value;
    let fechaIngreso    = document.getElementById("fecha-ingreso").value;

    // Generar el HTML del resumen y mostrarlo dentro del modal
    let resumen = document.getElementById("resumen-modal");
    resumen.innerHTML =
        "<p><strong>Nombre:</strong> " + nombre + " " + apellido + "</p>" +
        "<p><strong>Correo:</strong> " + correo + "</p>" +
        "<p><strong>Cargo:</strong> " + cargo + "</p>" +
        "<p><strong>Nacimiento:</strong> " + formatearFecha(fechaNacimiento) + "</p>" +
        "<p><strong>Ingreso:</strong> " + formatearFecha(fechaIngreso) + "</p>";

    // Mostrar el modal de Bootstrap
    modalConfirmacion.show();
}


// Confirma el registro y agrega el empleado a la lista
// Esta función se llama desde el botón "Confirmar" del modal

function confirmarAgregarEmpleado() {
    // Crear el objeto con los datos del nuevo empleado
    let nuevoEmpleado = {
        id:              Date.now(), // ID único usando timestamp
        nombre:          document.getElementById("nombre").value.trim(),
        apellido:        document.getElementById("apellido").value.trim(),
        fechaNacimiento: document.getElementById("fecha-nacimiento").value,
        correo:          document.getElementById("correo").value.trim(),
        cargo:           document.getElementById("cargo").value,
        fechaIngreso:    document.getElementById("fecha-ingreso").value
    };

    // Agregar el nuevo empleado al array global
    listaEmpleados.push(nuevoEmpleado);

    // Volver a renderizar la cuadrícula con el nuevo empleado
    actualizarGrilla();

    // Cerrar el modal
    modalConfirmacion.hide();

    // Limpiar el formulario para un nuevo ingreso
    limpiarFormulario();

    // Desplazarse suavemente a la sección de personal
    document.getElementById("personal").scrollIntoView({ behavior: "smooth" });
}


// MANIPULACIÓN DEL DOM — CUADRÍCULA


// Actualiza la cuadrícula de tarjetas de empleados en el DOM
// Lee el array listaEmpleados y renderiza las tarjetas

function actualizarGrilla() {
    let grilla      = document.getElementById("grilla-personal");
    let avisoVacio  = document.getElementById("aviso-vacio");

    // Limpiar el contenido actual de la cuadrícula
    grilla.innerHTML = "";

    // Si no hay empleados, mostrar el aviso y terminar
    if (listaEmpleados.length === 0) {
        avisoVacio.style.display = "block";
        return;
    }

    // Ocultar el aviso cuando hay al menos un empleado
    avisoVacio.style.display = "none";

    // Crear una tarjeta por cada empleado en la lista
    for (let i = 0; i < listaEmpleados.length; i++) {
        let columna = document.createElement("div");
        columna.className = "col-md-6 col-lg-4";
        columna.innerHTML = generarHTMLTarjeta(listaEmpleados[i]);
        grilla.appendChild(columna);
    }
}


// Genera el HTML de una tarjeta de empleado
// Retorna: cadena de texto con el HTML de la tarjeta

function generarHTMLTarjeta(empleado) {
    return (
        '<div class="tarjeta-empleado">' +
            '<button class="btn-eliminar" onclick="eliminarEmpleado(' + empleado.id + ')">Eliminar</button>' +
            '<p class="nombre-empleado">' + empleado.nombre + " " + empleado.apellido + "</p>" +
            '<span class="cargo-empleado">' + empleado.cargo + "</span>" +
            '<p class="detalle-empleado"><strong>Correo:</strong> ' + empleado.correo + "</p>" +
            '<p class="detalle-empleado"><strong>Nacimiento:</strong> ' + formatearFecha(empleado.fechaNacimiento) + "</p>" +
            '<p class="detalle-empleado"><strong>Ingreso:</strong> ' + formatearFecha(empleado.fechaIngreso) + "</p>" +
        "</div>"
    );
}


// Elimina un empleado de la lista por su ID
// Esta función se llama desde el botón "Eliminar" de cada tarjeta

function eliminarEmpleado(id) {
    // Buscar y eliminar el empleado con el ID indicado
    for (let i = 0; i < listaEmpleados.length; i++) {
        if (listaEmpleados[i].id === id) {
            listaEmpleados.splice(i, 1);
            break;
        }
    }

    // Actualizar la cuadrícula para reflejar el cambio
    actualizarGrilla();
}


// ------------------------------------------
// Limpia todos los campos del formulario
// ------------------------------------------
function limpiarFormulario() {
    document.getElementById("nombre").value          = "";
    document.getElementById("apellido").value        = "";
    document.getElementById("fecha-nacimiento").value = "";
    document.getElementById("correo").value          = "";
    document.getElementById("cargo").value           = "";
    document.getElementById("fecha-ingreso").value   = "";
    limpiarErrores();
}