// ==========================================
// 1. IMPORTACIONES DE MÓDULOS
// ==========================================

import { obtenerArtistas } from './datosArtistas.js';

import {
    renderizarArtistas,
    filtrarArtistas
} from './funcionesArtistas.js';

import { obtenerFanPacks } from './datosFanPacks.js';
import { agregarFanPack } from './reservasFanPacks.js';

import {
    estaSiguiendo,
    alternarSeguimiento
} from './artistasSeguidos.js';

import { mostrarDetalleArtista } from './detalleArtistas.js';


// ==========================================
// 2. REFERENCIAS AL DOM
// ==========================================

// Catálogo y filtros
const contenedorArtistas = document.getElementById("artistas-app");
const catalogoSeccion = document.getElementById("catalogo-seccion");
const detalleSeccion = document.getElementById("detalle-artista");
const inputBusqueda = document.getElementById("buscar-artista");
const filtrosGenero = document.querySelectorAll('input[name="genero"]');

// Nombre y botón de seguimiento
const detalleNombre = document.getElementById("detalle-artista-nombre");
const btnSeguir = document.querySelector(".boton-accion-negro");

// Contenedor de Fan Packs
const listaFanpacksArtista = document.getElementById("lista-fanpacks-artista");


// ==========================================
// 3. RENDERIZADO INICIAL DEL CATÁLOGO (ASÍNCRONO)
// ==========================================

async function inicializarCatalogoArtistas() {
    const artistasData = await obtenerArtistas();
    renderizarArtistas(contenedorArtistas, artistasData);
}

inicializarCatalogoArtistas();


// ==========================================
// 4. VOLVER AL CATÁLOGO
// ==========================================

function volverAlCatalogo(evento) {

    evento.preventDefault();

    detalleSeccion.classList.add("seccion-oculta");
    catalogoSeccion.classList.remove("seccion-oculta");

    window.location.hash = "catalogo-seccion";
}


// ==========================================
// 5. ACTUALIZAR GRILLA DE ARTISTAS (ASÍNCRONO)
// ==========================================

async function actualizarGrillaArtistas(texto, generoActivo) {

    const artistasData = await obtenerArtistas();

    const artistasFiltrados = filtrarArtistas(
        artistasData,
        generoActivo,
        texto
    );

    if (artistasFiltrados.length === 0) {

        contenedorArtistas.innerHTML = `
            <p style="grid-column: 1 / -1; text-align: center; color: var(--color-texto-secundario); padding: 40px 0; font-size: 1.1rem;">
                No se encontraron artistas con ese nombre o género. ¡Intenta con "Coldplay", "BTS" o "The Beatles"! 🎸
            </p>
        `;

    } else {

        renderizarArtistas(contenedorArtistas, artistasFiltrados);

    }
}


// ==========================================
// 6. EVENTOS DE BÚSQUEDA Y FILTROS
// ==========================================

inputBusqueda.addEventListener("input", async () => {

    const texto = inputBusqueda.value;

    const generoActivo = document.querySelector(
        'input[name="genero"]:checked'
    ).value;

    await actualizarGrillaArtistas(texto, generoActivo);

});

filtrosGenero.forEach(filtro => {

    filtro.addEventListener("change", async () => {

        const generoActivo = document.querySelector(
            'input[name="genero"]:checked'
        ).value;

        const texto = inputBusqueda.value;

        await actualizarGrillaArtistas(texto, generoActivo);

    });

});


// ==========================================
// 7. DELEGACIÓN DE EVENTOS
// ==========================================

document.addEventListener("click", async evento => {

    if (!(evento.target instanceof Element)) return;

    // Ver detalles del artista
    const botonVer = evento.target.closest(".tarjeta-artista__boton");

    if (botonVer) {

        const idArtista = botonVer.dataset.id;
        
        // Esperamos a que se muestre el detalle para que el DOM interno se pinte
        await mostrarDetalleArtista(idArtista);

        // Mostrar la sección de detalle
        catalogoSeccion.classList.add("seccion-oculta");
        detalleSeccion.classList.remove("seccion-oculta");

        detalleSeccion.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        window.location.hash = "detalle-artista";

        // Guardamos el nombre del artista en el dataset del botón de seguir para tenerlo siempre disponible
        if (btnSeguir) {
            btnSeguir.dataset.nombreArtista = detalleNombre.textContent.trim();
            cargarEstadoSeguir();
        }

        return;

    }

    // Volver al catálogo
    const botonVolver = evento.target.closest(".boton-volver");

    if (botonVolver) {

        volverAlCatalogo(evento);
        return;

    }

    // Botón Seguir
    const btnSeguirClick = evento.target.closest(".boton-accion-negro");

    if (btnSeguirClick && !detalleSeccion.classList.contains("seccion-oculta")) {

        // Obtenemos el nombre del artista directamente del atributo seguro del botón
        const nombreArtista = btnSeguirClick.dataset.nombreArtista || detalleNombre.textContent.trim();

        if (!nombreArtista) return;

        // Cambiar el estado de seguimiento en localStorage
        alternarSeguimiento(nombreArtista);

        // Actualizar visualmente el botón al instante
        actualizarBotonSeguir(btnSeguirClick, nombreArtista);

    }

});


// ==========================================
// 8. ACTUALIZAR ESTADO DEL BOTÓN SEGUIR
// ==========================================

function actualizarBotonSeguir(boton, nombreArtista) {

    if (estaSiguiendo(nombreArtista)) {

        boton.textContent = "✓ Siguiendo";
        boton.style.backgroundColor = "var(--color-primario-activo)";

    } else {

        boton.textContent = "+ Seguir";
        boton.style.backgroundColor = "#000000";

    }

}


// Cargar el estado guardado al abrir el detalle
function cargarEstadoSeguir() {

    if (!btnSeguir) return;

    const nombreArtista = btnSeguir.dataset.nombreArtista || detalleNombre.textContent.trim();

    actualizarBotonSeguir(btnSeguir, nombreArtista);

}


// ==========================================
// 9. AGREGAR FAN PACKS AL CARRITO
// ==========================================

if (listaFanpacksArtista) {

    listaFanpacksArtista.addEventListener("submit", async evento => {

        if (!evento.target.matches(".pack-compra__form")) return;

        evento.preventDefault();

        // Obtener ID del Fan Pack
        const idPack = Number(evento.target.dataset.idPack);

        // Obtenemos los fan packs de forma asíncrona desde el JSON
        const fanPacks = await obtenerFanPacks();
        const pack = fanPacks.find(p => p.id === idPack);

        if (!pack) return;

        // Obtener modalidad de retiro
        const modalidad = evento.target.querySelector("select").value;

        // Agregar el Fan Pack utilizando el módulo de reservas
        await agregarFanPack(idPack, modalidad);

        // Confirmación
        alert(
            `¡Excelente! "${pack.nombre}" se agregó al carrito.\n` +
            `Modalidad de retiro: ${modalidad === "estadio" ? "En estadio" : "Envío a domicilio"}.`
        );

        evento.target.reset();

    });

}