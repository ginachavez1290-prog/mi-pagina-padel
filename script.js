function mostrarSeccion(id) {
    // Oculta todas las secciones
    const secciones = document.querySelectorAll('.seccion');
    secciones.forEach(sec => sec.style.display = 'none');

    // Muestra solo la que corresponde al botón
    document.getElementById(id).style.display = 'block';
}

document.addEventListener("DOMContentLoaded", () => {
    const botonReserva = document.querySelector(
        ".btn-reservar-turno"
    );

    if (!botonReserva) return;

    botonReserva.classList.add("reserva-lista");

    botonReserva.addEventListener("keydown", (evento) => {
        if (evento.key === "Enter" || evento.key === " ") {
            botonReserva.classList.add("reserva-presionada");
        }
    });

    botonReserva.addEventListener("keyup", () => {
        botonReserva.classList.remove("reserva-presionada");
    });

    botonReserva.addEventListener("blur", () => {
        botonReserva.classList.remove("reserva-presionada");
    });
});
