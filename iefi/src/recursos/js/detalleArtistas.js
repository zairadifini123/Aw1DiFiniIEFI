
// ==========================================
// 1. IMPORTACIONES
// ==========================================

import { obtenerArtistas } from "./datosArtistas.js";
import { obtenerFanPacks } from "./datosFanPacks.js";


// ==========================================
// 2. MOSTRAR DETALLE DE UN ARTISTA
// ==========================================

export async function mostrarDetalleArtista(id) {

    // Obtener los artistas de forma asíncrona desde el JSON
    const artistasData = await obtenerArtistas();

    // Buscar artista por su ID
    const artista = artistasData.find(a => a.id === Number(id));

    if (!artista) {

        console.error("No se encontró el artista:", id);
        return;

    }


    // ==========================================
    // 3. OBTENER REFERENCIAS AL DOM
    // ==========================================

    const detalleImagen = document.getElementById("detalle-artista-imagen");
    const detalleNombre = document.getElementById("detalle-artista-nombre");
    const detalleDescripcion = document.getElementById("detalle-artista-descripcion");
    const detalleRecinto = document.getElementById("detalle-artista-recinto");
    const detalleFecha = document.getElementById("detalle-artista-fecha");
    const detallePuertas = document.getElementById("detalle-artista-puertas");
    const detalleInicio = document.getElementById("detalle-artista-inicio");
    const detalleAccesos = document.getElementById("detalle-artista-accesos");
    const detalleElementos = document.getElementById("detalle-artista-elementos");
    const detalleSetlist = document.getElementById("detalle-artista-setlist");

    const contenedorPack = document.getElementById("contenedor-fanpack-dinamico");
    const listaFanpacksArtista = document.getElementById("lista-fanpacks-artista");


    // ==========================================
    // 4. VALIDAR ELEMENTOS PRINCIPALES
    // ==========================================

    const elementosNecesarios = [
        detalleImagen,
        detalleNombre,
        detalleDescripcion,
        detalleRecinto,
        detalleFecha,
        detallePuertas,
        detalleInicio,
        detalleAccesos,
        detalleElementos,
        detalleSetlist
    ];

    if (elementosNecesarios.some(elemento => !elemento)) {

        console.error("No se encontraron todos los elementos del detalle del artista.");
        return;

    }


    // ==========================================
    // 5. MOSTRAR INFORMACIÓN DEL ARTISTA
    // ==========================================

    detalleImagen.src = artista.detalleImagen || artista.imagen;
    detalleImagen.alt = `Tour de ${artista.nombre}`;

    detalleNombre.textContent = artista.nombre;
    detalleDescripcion.textContent = artista.descripcion || "Sin descripción disponible.";
    detalleRecinto.textContent = artista.recinto || "No especificado";
    detalleFecha.textContent = artista.fecha || "No especificada";
    detallePuertas.textContent = artista.puertas || "No especificado";
    detalleInicio.textContent = artista.inicio || "No especificado";
    detalleAccesos.textContent = artista.accesos || "No especificados";
    detalleElementos.textContent = artista.elementos || "No especificados";


    // ==========================================
    // 6. MOSTRAR SETLIST
    // ==========================================

    if (Array.isArray(artista.setlist) && artista.setlist.length > 0) {

        detalleSetlist.innerHTML = artista.setlist
            .map(cancion => `<li class="canciones-lista__item">${cancion}</li>`)
            .join("");

    } else {

        detalleSetlist.innerHTML = `
            <li class="canciones-lista__item">
                Setlist no disponible.
            </li>
        `;

    }


    // ==========================================
    // 7. BUSCAR FAN PACKS DEL ARTISTA (ASÍNCRONO)
    // ==========================================

    const fanPacks = await obtenerFanPacks();

    const fanpacksDelArtista = fanPacks.filter(pack => {

        return pack.artista === artista.nombre;

    });


    // ==========================================
    // 8. MOSTRAR FAN PACKS
    // ==========================================

    if (contenedorPack && listaFanpacksArtista) {

        contenedorPack.style.display = "block";

        if (fanpacksDelArtista.length > 0) {

            listaFanpacksArtista.innerHTML = fanpacksDelArtista.map(pack => `

                <div class="pack-compra">

                    <div class="pack-compra__cabecera">

                        <div class="pack-compra__miniatura">

                            <img
                                src="${pack.imagen}"
                                alt="${pack.nombre}"
                            >

                        </div>

                        <div class="pack-compra__datos">

                            <h4 class="pack-compra__nombre">
                                ${pack.nombre}
                            </h4>

                            <p class="pack-compra__descripcion">
                                ${pack.descripcion}
                            </p>

                        </div>

                    </div>

                    <form class="pack-compra__form" data-id-pack="${pack.id}">

                        <label
                            class="visually-hidden"
                            for="retiro-${pack.id}"
                        >
                            Modalidad de retiro
                        </label>

                        <select
                            class="pack-compra__select"
                            name="modalidad-retiro"
                            id="retiro-${pack.id}"
                            required
                        >

                            <option value="estadio">
                                Retiro: En estadio (Día del show)
                            </option>

                            <option value="domicilio">
                                Envío postal a domicilio
                            </option>

                        </select>

                        <div class="pack-compra__pie">

                            <span class="pack-compra__precio">
                                $${Number(pack.precio).toLocaleString("es-AR")}
                            </span>

                            <button
                                class="boton-pack-agregar"
                                type="submit"
                            >
                                + Agregar al Carrito
                            </button>

                        </div>

                    </form>

                </div>

            `).join("");

        } else {

            listaFanpacksArtista.innerHTML = `
                <p>
                    Aún no hay Fan Packs disponibles para esta gira.
                </p>
            `;

        }

    }

}