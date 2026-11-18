import { obtenerEventos } from "./datosEventos.js";


// ==================================================
// 1. ELEMENTOS DEL HTML
// ==================================================

const vistaDetalleEvento = document.querySelector(
    "#detalles-evento"
);

const imagenDetalleEvento = document.querySelector(
    "#imagen-detalle-evento"
);

const artistaDetalleEvento = document.querySelector(
    "#artista-detalle-evento"
);

const nombreDetalleEvento = document.querySelector(
    "#nombre-detalle-evento"
);

const descripcionDetalleEvento = document.querySelector(
    "#descripcion-detalle-evento"
);

const fechaDetalleEvento = document.querySelector(
    "#fecha-detalle-evento"
);

const aperturaPuertasEvento = document.querySelector(
    "#apertura-puertas-evento"
);

const inicioShowEvento = document.querySelector(
    "#inicio-show-evento"
);

const accesosEvento = document.querySelector(
    "#accesos-evento"
);

const elementosPermitidosEvento = document.querySelector(
    "#elementos-permitidos-evento"
);

const setlistEvento = document.querySelector(
    "#setlist-evento"
);

const retiroFanPackEvento = document.querySelector(
    "#retiro-fanpack-evento"
);


// ==================================================
// 2. MOSTRAR DETALLE DE UN EVENTO
// ==================================================

export async function abrirDetalleEvento(id, mostrarSeccion) {

    // Obtener los eventos desde el JSON de forma asíncrona
    const eventos = await obtenerEventos();

    // Buscar el evento seleccionado
    const evento = eventos.find(item => {
        return item.id === Number(id);
    });

    if (!evento) {

        console.error("No se encontró el evento:", id);
        return;

    }

    // Comprobar que existan los elementos HTML necesarios
    if (
        !vistaDetalleEvento ||
        !imagenDetalleEvento ||
        !artistaDetalleEvento ||
        !nombreDetalleEvento ||
        !descripcionDetalleEvento ||
        !fechaDetalleEvento ||
        !aperturaPuertasEvento ||
        !inicioShowEvento ||
        !accesosEvento ||
        !elementosPermitidosEvento ||
        !setlistEvento ||
        !retiroFanPackEvento
    ) {

        console.error("Faltan elementos HTML del detalle del evento.");
        return;

    }

    // Comprobar que existan los detalles del evento
    const detalles = evento.detalles;

    if (!detalles) {

        console.error("El evento no tiene información de detalles:", id);
        return;

    }

    // Cargar la información principal
    if (evento.imagen) {
        imagenDetalleEvento.src = evento.imagen;
    }

    imagenDetalleEvento.alt = `Evento de ${evento.artista}`;

    artistaDetalleEvento.textContent = evento.artista;
    nombreDetalleEvento.textContent = evento.artista;

    descripcionDetalleEvento.textContent =
        `Evento en ${evento.recinto}`;

    fechaDetalleEvento.textContent = evento.fecha;


    // Cargar horarios
    aperturaPuertasEvento.textContent =
        detalles.aperturaPuertas || "Sin información";

    inicioShowEvento.textContent =
        detalles.inicioShow || "Sin información";


    // Cargar accesos
    accesosEvento.textContent =
        Array.isArray(detalles.accesos) && detalles.accesos.length > 0
            ? detalles.accesos.join(", ")
            : "Sin información disponible";


    // Cargar elementos permitidos
    elementosPermitidosEvento.innerHTML = `
        <strong>Elementos permitidos:</strong>
        ${Array.isArray(detalles.elementosPermitidos) &&
        detalles.elementosPermitidos.length > 0
            ? detalles.elementosPermitidos.join(", ")
            : "Sin información disponible"
        }
    `;


    // Cargar setlist
    setlistEvento.innerHTML =
        Array.isArray(detalles.setlist) && detalles.setlist.length > 0
            ? detalles.setlist.map(cancion => `
                <li class="canciones-lista__item">
                    ${cancion}
                </li>
            `).join("")
            : `
                <li class="canciones-lista__item">
                    Sin información disponible
                </li>
            `;


    // Cargar información sobre el retiro del Fan Pack
    retiroFanPackEvento.textContent =
        detalles.retiroFanPack || "Información no disponible.";


    // Mostrar la sección del evento
    mostrarSeccion(vistaDetalleEvento);

    // Actualizar la dirección de navegación
    window.location.hash = "detalles-evento";

}