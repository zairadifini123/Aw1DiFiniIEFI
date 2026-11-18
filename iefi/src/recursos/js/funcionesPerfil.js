// ==========================================
// IMPORTACIONES
// ==========================================

import { obtenerArtistas } from "./datosArtistas.js";
import { obtenerArtistasSeguidos } from "./artistasSeguidos.js";
import { obtenerFanPacks } from "./datosFanPacks.js";
import { obtenerEventos } from "./datosEventos.js";
import { obtenerFavoritos } from "./eventosFavoritos.js";


// ==========================================
// 1. RENDERIZAR ARTISTAS SEGUIDOS (ASÍNCRONO)
// ==========================================

export async function renderizarArtistasPerfil(grillaArtistas, genero) {

    if (!genero || !grillaArtistas) {
        return;
    }

    // Obtener los artistas de forma asíncrona desde el JSON
    const artistasData = await obtenerArtistas();

    // Obtener artistas seguidos
    const nombresSeguidos = obtenerArtistasSeguidos();

    // Filtrar artistas
    const artistasFiltrados = artistasData.filter(artista => {

        const estaSeguido = nombresSeguidos.includes(artista.nombre);

        const coincideGenero =
            genero === "todos" || artista.genero === genero;

        return estaSeguido && coincideGenero;

    });

    // Mostrar mensaje si no hay resultados
    if (artistasFiltrados.length === 0) {

        const mensaje = nombresSeguidos.length === 0
            ? "Aún no seguís a ningún artista. ¡Explorá el catálogo para agregarlos! 🎸"
            : "No hay artistas seguidos en este género.";

        grillaArtistas.innerHTML = `
            <li class="perfil-mensaje-vacio"
                style="grid-column: 1 / -1; text-align: center; padding: 30px; color: var(--color-texto-secundario); font-size: 1.1rem;">

                ${mensaje}

            </li>
        `;

        return;

    }

    // Mostrar artistas seguidos
    grillaArtistas.innerHTML = artistasFiltrados.map(artista => `

        <li class="perfil-item-grid">

            <figure>

                <img
                    class="perfil-imagen-grid"
                    src="${artista.imagen}"
                    alt="Foto de ${artista.nombre}"
                >

                <figcaption class="perfil-figcaption">
                    ${artista.nombre}
                </figcaption>

            </figure>

        </li>

    `).join("");

}


// ==========================================
// 2. RENDERIZAR CATÁLOGO DE FAN PACKS
// ==========================================

export async function renderizarFanPacksPerfil(grillaFanPacks, genero, reservas) {

    if (!genero || !grillaFanPacks) {
        return;
    }

    // Obtener Fan Packs de forma asíncrona desde el JSON
    const fanPacks = await obtenerFanPacks();

    // Filtrar Fan Packs
    const packsFiltrados = fanPacks.filter(pack => {

        return genero === "todos" || pack.genero === genero;

    });

    if (packsFiltrados.length === 0) {

        grillaFanPacks.innerHTML = `
            <li class="perfil-mensaje-vacio">
                No hay Fan Packs disponibles en este género.
            </li>
        `;

        return;

    }

    // Mostrar Fan Packs
    grillaFanPacks.innerHTML = packsFiltrados.map(pack => {

        const reservaExistente = reservas.find(reserva => {

            return reserva.id === pack.id;

        });

        return `

            <li class="perfil-item-grid">

                <figure>

                    <img
                        class="perfil-imagen-grid"
                        src="${pack.imagen}"
                        alt="Fan Pack de ${pack.artista}"
                    >

                </figure>

                <h3 class="perfil-subtitulo perfil-subtitulo--pequeno">
                    ${pack.nombre}
                </h3>

                <p class="perfil-texto">
                    Artista: ${pack.artista}
                </p>

                <p class="perfil-texto">
                    ${pack.descripcion}
                </p>

                <p class="perfil-texto">
                    Precio: $${pack.precio.toLocaleString("es-AR")}
                </p>

                <button
                    class="perfil-boton perfil-boton--pequeno boton-ver-detalle"
                    type="button"
                    data-pack-id="${pack.id}"
                >
                    Ver detalles
                </button>

                ${reservaExistente ? `

                    <div class="contenedor-acciones-carrito">

                        <span class="perfil-texto">
                            Reservado (${reservaExistente.cantidad} un.)
                        </span>

                        <button
                            class="perfil-boton perfil-boton--pequeno boton-agregar-pack"
                            type="button"
                            data-pack-id="${pack.id}"
                        >
                            Agregar otra unidad
                        </button>

                        <button
                            class="perfil-boton perfil-boton--pequeno boton-quitar-pack"
                            type="button"
                            data-pack-id="${pack.id}"
                        >
                            Sacar de carrito
                        </button>

                    </div>

                ` : `

                    <button
                        class="perfil-boton perfil-boton--pequeno boton-agregar-pack"
                        type="button"
                        data-pack-id="${pack.id}"
                    >
                        + Agregar
                    </button>

                `}

            </li>

        `;

    }).join("");

}


// ==========================================
// 3. RENDERIZAR TABLA DE RESERVAS
// ==========================================

export function renderizarReservasPerfil(tablaReservas, reservas) {

    if (!tablaReservas) {
        return;
    }

    if (reservas.length === 0) {

        tablaReservas.innerHTML = `

            <tr>

                <td colspan="5">

                    <p>Todavía no tenés Fan Packs reservados.</p>

                    <a href="#detalles-fanpack" class="perfil-boton-tabla">
                        Ver Fan Packs disponibles
                    </a>

                </td>

            </tr>

        `;

        return;

    }

    tablaReservas.innerHTML = reservas.map(reserva => {

        const precioFinal = reserva.precio * reserva.cantidad;

        return `

            <tr>

                <td>${reserva.nombre}</td>

                <td>${reserva.cantidad}</td>

                <td>$${precioFinal.toLocaleString("es-AR")}</td>

                <td>
                    <span class="perfil-badge">
                        Reservado
                    </span>
                </td>

                <td>

                    <button
                        type="button"
                        class="perfil-boton-tabla boton-ver-pack-reservado"
                        data-pack-id="${reserva.id}"
                    >
                        Ver pack
                    </button>

                </td>

            </tr>

        `;

    }).join("");

}


// ==========================================
// 4. RENDERIZAR EVENTOS GUARDADOS (ASÍNCRONO)
// ==========================================

export async function renderizarEventosGuardadosPerfil(listaEventosGuardados) {

    if (!listaEventosGuardados) {
        return;
    }

    // Obtener los eventos de forma asíncrona desde el JSON
    const eventos = await obtenerEventos();

    // Obtener eventos favoritos
    const favoritos = obtenerFavoritos();

    const eventosGuardados = eventos.filter(evento => {

        return favoritos.includes(Number(evento.id));

    });

    if (eventosGuardados.length === 0) {

        listaEventosGuardados.innerHTML = `

            <p class="perfil-mensaje-vacio">
                Todavía no guardaste ningún evento.
            </p>

        `;

        return;

    }

    // Mostrar eventos guardados
    listaEventosGuardados.innerHTML = eventosGuardados.map(evento => `

        <article class="perfil-evento-item">

            <div class="perfil-evento-info">

                <span class="perfil-evento-titulo">
                    ${evento.artista}
                </span>

                <span class="perfil-evento-detalle">
                    ${evento.recinto}
                </span>

            </div>

            <div class="perfil-evento-acciones">

                <span class="perfil-evento-fecha">
                    ${evento.fecha}
                </span>

                <button
                    type="button"
                    class="perfil-boton-tabla boton-ver-detalle-guardado"
                    data-evento-id="${evento.id}"
                >
                    Ver detalles
                </button>

                <button
                    type="button"
                    class="perfil-boton-tabla boton-quitar-evento"
                    data-evento-id="${evento.id}"
                >
                    Quitar de guardados
                </button>

            </div>

        </article>

    `).join("");

}