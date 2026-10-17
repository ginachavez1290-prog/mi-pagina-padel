
const CLAVE = "reservasPadelCenterRojas";
const MAX_CANCHAS = 3;

const formulario = document.getElementById("reservaForm");
const nombre = document.getElementById("nombre");
const fecha = document.getElementById("fecha");
const hora = document.getElementById("hora");
const lista = document.getElementById("listaReservas");
const contador = document.getElementById("cantidadReservas");
const mensaje = document.getElementById("mensaje");

document.getElementById("anio").textContent = new Date().getFullYear();

function fechaLocal() {
    const hoy = new Date();
    hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
    return hoy.toISOString().slice(0, 10);
}

fecha.min = fechaLocal();

function obtenerReservas() {
    try {
        const datos = JSON.parse(localStorage.getItem(CLAVE) || "[]");
        return Array.isArray(datos) ? datos : [];
    } catch {
        return [];
    }
}

function guardarReservas(reservas) {
    localStorage.setItem(CLAVE, JSON.stringify(reservas));
}

function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = tipo;
}

function fechaBonita(valor) {
    const [anio, mes, dia] = valor.split("-");
    return `${dia}/${mes}/${anio}`;
}

function iniciales(nombreCompleto) {
    return nombreCompleto
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(palabra => palabra[0].toUpperCase())
        .join("");
}

function dibujarReservas() {
    const reservas = obtenerReservas().sort((a, b) =>
        `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`)
    );

    contador.textContent = reservas.length;
    lista.innerHTML = "";

    if (reservas.length === 0) {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td colspan="5" class="vacio">
                <strong>Todavía no hay reservas</strong>
                <small>Cuando confirmes un turno, aparecerá acá.</small>
            </td>`;
        lista.appendChild(fila);
        return;
    }

    reservas.forEach(reserva => {
        const fila = document.createElement("tr");

        const jugador = document.createElement("td");
        const avatar = document.createElement("span");
        avatar.className = "avatar";
        avatar.textContent = iniciales(reserva.nombre);

        jugador.appendChild(avatar);
        jugador.appendChild(document.createTextNode(reserva.nombre));

        const celdaFecha = document.createElement("td");
        celdaFecha.textContent = fechaBonita(reserva.fecha);

        const celdaHora = document.createElement("td");
        celdaHora.textContent = reserva.hora;

        const celdaCancha = document.createElement("td");
        const etiqueta = document.createElement("span");
        etiqueta.className = "cancha-etiqueta";
        etiqueta.textContent = `Cancha ${reserva.cancha}`;
        celdaCancha.appendChild(etiqueta);

        const celdaAccion = document.createElement("td");
        const boton = document.createElement("button");
        boton.className = "cancelar";
        boton.type = "button";
        boton.textContent = "Cancelar";
        boton.addEventListener("click", () => cancelarReserva(reserva.id));
        celdaAccion.appendChild(boton);

        fila.append(
            jugador,
            celdaFecha,
            celdaHora,
            celdaCancha,
            celdaAccion
        );

        lista.appendChild(fila);
    });
}

function cancelarReserva(id) {
    const reservas = obtenerReservas();
    const reserva = reservas.find(item => item.id === id);

    if (!reserva) return;

    if (!confirm(`¿Cancelar la reserva de ${reserva.nombre}?`)) {
        return;
    }

    guardarReservas(reservas.filter(item => item.id !== id));
    dibujarReservas();
    mostrarMensaje("La reserva se canceló correctamente.", "exito");
}

formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();

    document.getElementById("nombreError").textContent = "";
    document.getElementById("fechaError").textContent = "";
    document.getElementById("horaError").textContent = "";
    mostrarMensaje("", "");

    const jugador = nombre.value.trim();
    const dia = fecha.value;
    const horario = hora.value;
    let valido = true;

    if (jugador.length < 3) {
        document.getElementById("nombreError").textContent =
            "Ingresá tu nombre y apellido.";
        valido = false;
    }

    if (!dia || dia < fechaLocal()) {
        document.getElementById("fechaError").textContent =
            "Elegí una fecha válida, desde hoy en adelante.";
        valido = false;
    }

    if (!horario) {
        document.getElementById("horaError").textContent =
            "Elegí un horario.";
        valido = false;
    }

    if (!valido) {
        mostrarMensaje("Revisá los campos marcados.", "error-mensaje");
        return;
    }

    const reservas = obtenerReservas();

    const mismoTurno = reservas.filter(reserva =>
        reserva.fecha === dia && reserva.hora === horario
    );

    if (mismoTurno.length >= MAX_CANCHAS) {
        mostrarMensaje(
            "Ese horario ya tiene las tres canchas ocupadas. Elegí otro.",
            "error-mensaje"
        );
        return;
    }

    const ocupadas = new Set(mismoTurno.map(reserva => reserva.cancha));
    let canchaLibre = 1;

    while (ocupadas.has(canchaLibre)) {
        canchaLibre++;
    }

    const nuevaReserva = {
        id: (crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random()}`),
        nombre: jugador,
        fecha: dia,
        hora: horario,
        cancha: canchaLibre
    };

    try {
        reservas.push(nuevaReserva);
        guardarReservas(reservas);
        dibujarReservas();
        formulario.reset();
        fecha.min = fechaLocal();

        mostrarMensaje(
            `¡Reserva confirmada! Te asignamos la cancha ${canchaLibre}.`,
            "exito"
        );
    } catch {
        mostrarMensaje(
            "No se pudo guardar la reserva en este navegador.",
            "error-mensaje"
        );
    }
});

dibujarReservas();
