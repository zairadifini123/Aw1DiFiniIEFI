// ==========================================
// IMPORTACIONES
// ==========================================

import { obtenerFanPacks } from "./datosFanPacks.js";

import {
    obtenerReservas,
    agregarFanPack as agregarReservaFanPack,
    quitarFanPack as quitarReservaFanPack
} from "./reservasFanPacks.js";

import {
    renderizarArtistasPerfil,
    renderizarFanPacksPerfil,
    renderizarReservasPerfil,
    renderizarEventosGuardadosPerfil
} from "./funcionesPerfil.js";

import {
    alternarFavorito
} from "./eventosFavoritos.js";

import { inicializarModuloEventos } from "./moduloEventos.js";

import { abrirDetalleEvento } from "./detalleEventos.js";

import {
    abrirDetalleFanPack,
    actualizarVistaDetalle
} from "./detalleCatalogo.js";


// ==========================================
// 1. VARIABLES Y ELEMENTOS DEL HTML
// ==========================================

let reservas = [];

// Filtros
const filtrosArtistas = document.querySelectorAll(
    'input[name="filtro-artista"]'
);

const filtrosPacks = document.querySelectorAll(
    'input[name="filtro-pack"]'
);

// Contenedores
const grillaArtistas = document.querySelector("#grilla-artistas");
const grillaFanPacks = document.querySelector("#grilla-fanpacks");
const tablaReservas = document.querySelector("#tabla-reservas");

const listaEventosGuardados = document.querySelector(
    "#lista-eventos-guardados"
);

const contenedorEventos = document.querySelector(
    "#contenedor-modulo-eventos"
);

// Secciones que se ocultan durante la navegación
const seccionesOcultables = document.querySelectorAll(
    "#artistas-seguidos, #detalles-fanpack, #detalles-evento, #vista-detalle-fanpack"
);


// ==========================================
// 2. ACTUALIZAR RESERVAS
// ==========================================

async function actualizarReservas() {

    // Obtener nuevamente las reservas del catálogo de forma asíncrona
    reservas = await obtenerReservas();

}


// ==========================================
// 3. NAVEGACIÓN ENTRE SECCIONES
// ==========================================

function ocultarSecciones() {

    seccionesOcultables.forEach(seccion => {

        seccion.style.display = "none";
        seccion.classList.add("seccion-oculta");

    });

}


function mostrarSeccion(seccion) {

    if (!seccion) {

        console.error("No se encontró la sección.");
        return;

    }

    ocultarSecciones();

    seccion.style.display = "block";
    seccion.classList.remove("seccion-oculta");

    seccion.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


// ==========================================
// 4. RENDERIZAR ARTISTAS SEGUIDOS (ASÍNCRONO)
// ==========================================

async function renderizarArtistas() {

    const filtro = document.querySelector(
        'input[name="filtro-artista"]:checked'
    );

    await renderizarArtistasPerfil(
        grillaArtistas,
        filtro?.value
    );

}


// ==========================================
// 5. RENDERIZAR CATÁLOGO DE FAN PACKS
// ==========================================

async function renderizarFanPacks() {

    const filtro = document.querySelector(
        'input[name="filtro-pack"]:checked'
    );

    await renderizarFanPacksPerfil(
        grillaFanPacks,
        filtro?.value,
        reservas
    );

}


// ==========================================
// 6. AGREGAR FAN PACK A LAS RESERVAS
// ==========================================

async function agregarPackDesdePerfil(id) {

    const fanPacks = await obtenerFanPacks();

    const pack = fanPacks.find(item => {

        return item.id === Number(id);

    });

    if (!pack) {

        console.error("No se encontró el Fan Pack:", id);
        return;

    }

    // Delegar la operación al módulo de reservas
    await agregarReservaFanPack(pack.id);

    // Actualizar la información
    await actualizarReservas();

    await renderizarReservas();
    await renderizarFanPacks();

    await actualizarVistaDetalle(pack.id);

}


// ==========================================
// 7. QUITAR FAN PACK DE LAS RESERVAS
// ==========================================

async function quitarPackDesdePerfil(id) {

    const fanPacks = await obtenerFanPacks();

    const pack = fanPacks.find(item => {

        return item.id === Number(id);

    });

    if (!pack) {

        console.error("No se encontró el Fan Pack:", id);
        return;

    }

    // Delegar la eliminación al módulo de reservas
    await quitarReservaFanPack(pack.id);

    // Actualizar la información
    await actualizarReservas();

    await renderizarReservas();
    await renderizarFanPacks();

    await actualizarVistaDetalle(pack.id);

}


// ==========================================
// 8. RENDERIZAR TABLA DE RESERVAS
// ==========================================

async function renderizarReservas() {

    await renderizarReservasPerfil(
        tablaReservas,
        reservas
    );

}


// ==========================================
// 9. RENDERIZAR EVENTOS GUARDADOS
// ==========================================

async function renderizarEventosGuardados() {

    await renderizarEventosGuardadosPerfil(
        listaEventosGuardados
    );

}


// ==========================================
// 10. CONFIGURAR FILTROS
// ==========================================

filtrosArtistas.forEach(filtro => {

    filtro.addEventListener("change", async () => {
        await renderizarArtistas();
    });

});

filtrosPacks.forEach(filtro => {

    filtro.addEventListener("change", async () => {
        await renderizarFanPacks();
    });

});


// ==========================================
// 11. MANEJAR BOTONES Y ENLACES
// ==========================================

document.addEventListener("click", async evento => {

    if (!(evento.target instanceof Element)) {
        return;
    }


    // VER DETALLES DESDE EL CATÁLOGO DE FAN PACKS

    const botonDetalle = evento.target.closest(
        ".boton-ver-detalle"
    );

    if (botonDetalle) {

        abrirDetalleFanPack(
            botonDetalle.dataset.packId,
            mostrarSeccion
        );

        return;

    }


    // VER PACK DESDE LA TABLA DE RESERVAS

    const botonVerPack = evento.target.closest(
        ".boton-ver-pack-reservado"
    );

    if (botonVerPack) {

        abrirDetalleFanPack(
            botonVerPack.dataset.packId,
            mostrarSeccion
        );

        return;

    }


    // VER DETALLES DE EVENTOS GUARDADOS

    const botonDetalleEvento = evento.target.closest(
        ".boton-ver-detalle-guardado"
    );

    if (botonDetalleEvento) {

        abrirDetalleEvento(
            botonDetalleEvento.dataset.eventoId,
            mostrarSeccion
        );

        return;

    }


    // AGREGAR FAN PACK

    const botonAgregar = evento.target.closest(
        ".boton-agregar-pack"
    );

    if (botonAgregar) {

        await agregarPackDesdePerfil(
            botonAgregar.dataset.packId
        );

        return;

    }


    // QUITAR FAN PACK

    const botonQuitarPack = evento.target.closest(
        ".boton-quitar-pack"
    );

    if (botonQuitarPack) {

        await quitarPackDesdePerfil(
            botonQuitarPack.dataset.packId
        );

        return;

    }


    // QUITAR EVENTO DE FAVORITOS

    const botonQuitarEvento = evento.target.closest(
        ".boton-quitar-evento"
    );

    if (botonQuitarEvento) {

        const id = Number(
            botonQuitarEvento.dataset.eventoId
        );

        alternarFavorito(id);

        return;

    }


    // MANEJAR ENLACES DE NAVEGACIÓN

    const enlace = evento.target.closest("a");

    if (!enlace) {
        return;
    }

    const destino = enlace.getAttribute("href");

    const destinosPermitidos = [
        "#artistas-seguidos",
        "#detalles-fanpack",
        "#detalles-evento",
        "#eventos-perfil"
    ];

    if (!destinosPermitidos.includes(destino)) {
        return;
    }

    evento.preventDefault();

    const seccion = document.querySelector(destino);

    if (!seccion) {

        console.error("No se encontró la sección:", destino);
        return;

    }

    mostrarSeccion(seccion);

    window.location.hash = destino;

});


// ==========================================
// 12. ESCUCHAR LA SELECCIÓN DE UN EVENTO
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


// ==========================================
// 13. SINCRONIZAR EVENTOS, ARTISTAS Y RESERVAS
// ==========================================

// Actualizar eventos guardados cuando cambian los favoritos
window.addEventListener("favoritosActualizados", async () => {

    await renderizarEventosGuardados();

});


// Actualizar información cuando cambian datos desde otra pestaña
window.addEventListener("storage", async evento => {

    if (evento.key === "eventosFavoritos") {

        await renderizarEventosGuardados();

    }

    if (evento.key === "artistasSeguidos") {

        await renderizarArtistas();

    }

    // Actualizar reservas si cambian desde otra pestaña
    if (
        evento.key &&
        evento.key.startsWith("reservaFanPack_")
    ) {

        await actualizarReservas();

        await renderizarReservas();
        await renderizarFanPacks();

    }

});


// ==========================================
// 14. INICIALIZACIÓN
// ==========================================

async function inicializarPerfil() {

    ocultarSecciones();

    await actualizarReservas();

    await renderizarArtistas();
    await renderizarFanPacks();
    await renderizarReservas();
    await renderizarEventosGuardados();

    // Inicializar el módulo de eventos
    inicializarModuloEventos(contenedorEventos);

}

inicializarPerfil();