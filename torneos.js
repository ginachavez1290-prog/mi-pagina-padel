
const modal = document.getElementById("modalInscripcion");
const formulario = document.getElementById("formInscripcion");
const selector = document.getElementById("torneoElegido");
const mensaje = document.getElementById("mensajeInscripcion");

const nombresTorneos = {
    express: "Torneo Express",
    parejas: "Torneo de Parejas",
    mixto: "Torneo Mixto"
};

function abrirModal(torneo = "") {
    formulario.reset();
    mensaje.textContent = "";
    mensaje.className = "";

    document.getElementById("tituloModal").textContent =
        torneo ? "Inscribite al torneo" : "Quiero participar";

    selector.value = torneo;

    modal.classList.add("visible");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function cerrarModal() {
    modal.classList.remove("visible");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

document.getElementById("abrirInscripcion")
    .addEventListener("click", () => abrirModal());

document.getElementById("cerrarModal")
    .addEventListener("click", cerrarModal);

modal.addEventListener("click", evento => {
    if (evento.target === modal) {
        cerrarModal();
    }
});

document.addEventListener("keydown", evento => {
    if (evento.key === "Escape") {
        cerrarModal();
    }
});

document.querySelectorAll(".boton-detalles").forEach(boton => {
    boton.addEventListener("click", () => {
        const torneo = boton.dataset.torneo;
        abrirModal(torneo);

        document.getElementById("descripcionModal").textContent =
            `Completá tus datos para solicitar tu inscripción a ${nombresTorneos[torneo]}. La organización deberá confirmar tu lugar.`;
    });
});

// Filtros por categoría
document.querySelectorAll(".filtro").forEach(boton => {
    boton.addEventListener("click", () => {
        document.querySelectorAll(".filtro").forEach(filtro => {
            filtro.classList.remove("activo");
        });

        boton.classList.add("activo");

        const categoria = boton.dataset.filtro;

        document.querySelectorAll(".torneo-card").forEach(tarjeta => {
            const mostrar =
                categoria === "todos" ||
                tarjeta.dataset.categoria === categoria;

            tarjeta.style.display = mostrar ? "" : "none";
        });
    });
});

// Guardar solicitudes de inscripción en este navegador
formulario.addEventListener("submit", evento => {
    evento.preventDefault();

    const nombre = document.getElementById("nombreJugador")
        .value.trim();

    const telefono = document.getElementById("contactoJugador")
        .value.trim();

    const pareja = document.getElementById("nombrePareja")
        .value.trim();

    const torneo = selector.value;

    if (nombre.length < 3 || telefono.length < 6 || !torneo) {
        mensaje.textContent =
            "Revisá tu nombre, teléfono y el torneo seleccionado.";
        mensaje.className = "error";
        return;
    }

    let inscripciones = [];

    try {
        inscripciones = JSON.parse(
            localStorage.getItem("inscripcionesPadelRojas") || "[]"
        );

        if (!Array.isArray(inscripciones)) {
            inscripciones = [];
        }
    } catch {
        inscripciones = [];
    }

    inscripciones.push({
        nombre,
        telefono,
        pareja,
        torneo: nombresTorneos[torneo],
        fechaSolicitud: new Date().toISOString()
    });

    try {
        localStorage.setItem(
            "inscripcionesPadelRojas",
            JSON.stringify(inscripciones)
        );

        mensaje.textContent =
            "¡Solicitud guardada! Recordá que la inscripción todavía debe ser confirmada por el club.";

        mensaje.className = "exito";
        formulario.reset();
    } catch {
        mensaje.textContent =
            "No se pudo guardar la solicitud en este navegador.";
        mensaje.className = "error";
    }
});
