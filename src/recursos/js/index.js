

// ==========================================
// IMPORTACIONES
// ==========================================

import { inicializarModuloEventos } from "./moduloEventos.js";
import { abrirDetalleEvento } from "./detalleEventos.js";


// ==========================================
// 1. OBTENER ELEMENTOS DEL HTML
// ==========================================

// Contenedor del módulo de eventos
const contenedorEventos = document.querySelector(
    "#contenedor-modulo-eventos"
);


// ==========================================
// 2. MOSTRAR SECCIONES
// ==========================================

function mostrarSeccion(seccion) {

    if (!seccion) {

        console.error("No se encontró la sección.");
        return;

    }

    seccion.style.display = "block";
    seccion.classList.remove("seccion-oculta");

    seccion.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


// ==========================================
// 3. INICIALIZAR MÓDULO DE EVENTOS
// ==========================================

inicializarModuloEventos(contenedorEventos);


// ==========================================
// 4. ESCUCHAR LA SELECCIÓN DE UN EVENTO
// ==========================================

if (contenedorEventos) {

    contenedorEventos.addEventListener(
        "abrirDetalleEvento",
        (evento) => {

            const id = evento.detail.id;

            abrirDetalleEvento(
                id,
                mostrarSeccion
            );

        }
    );

}
