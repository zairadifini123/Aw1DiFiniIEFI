
import { estaGuardado } from "./eventosFavoritos.js";


// ==========================================
// 1. RENDERIZAR TARJETAS DE EVENTOS
// ==========================================

export function renderizarEventos(listaEventos, grillaResultados, seccionResultados) {

    // Limpiar los resultados anteriores
    grillaResultados.innerHTML = "";

    // Si no hay eventos, ocultar la sección
    if (listaEventos.length === 0) {

        seccionResultados.hidden = true;

        return;

    }

    let eventosHTML = "";

    // Recorrer los eventos recibidos
    listaEventos.forEach(evento => {

        const guardado = estaGuardado(evento.id);

        eventosHTML += `

            <article class="tarjeta-evento">

                <h3 class="tarjeta-evento__ranking">
                    ${evento.artista}
                </h3>

                <ul class="tarjeta-evento__detalles">

                    <li class="tarjeta-evento__item">
                        Recinto: ${evento.recinto}
                    </li>

                    <li class="tarjeta-evento__item">
                        Fecha: ${evento.fecha}
                    </li>

                    <li class="tarjeta-evento__item">
                        ${evento.interesados} interesados
                    </li>

                </ul>

                <button
                    class="boton boton--secundario boton-favorito"
                    type="button"
                    data-evento-id="${evento.id}"
                >

                    ${guardado
                        ? "Quitar de guardados"
                        : "Guardar evento"
                    }

                </button>

                <button
                    class="boton boton--secundario boton-ver-detalle-evento"
                    type="button"
                    data-evento-id="${evento.id}"
                >

                    Ver detalles

                </button>

            </article>

        `;

    });

    // Insertar las tarjetas en el HTML
    grillaResultados.innerHTML = eventosHTML;

    // Mostrar la sección de resultados
    seccionResultados.hidden = false;

}
