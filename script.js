function mostrarSeccion(id) {
    // Oculta todas las secciones
    const secciones = document.querySelectorAll('.seccion');
    secciones.forEach(sec => sec.style.display = 'none');

    // Muestra solo la que corresponde al botón
    document.getElementById(id).style.display = 'block';
}
