// ==========================================
// IMPORTACIONES
// ==========================================

import { obtenerEventos } from "./datosEventos.js";

import { alternarFavorito } from "./eventosFavoritos.js";

import { renderizarEventos } from "./eventosRenderizado.js";

import { filtrarEventos } from "./eventosFiltrado.js";


// ==========================================
// 1. INICIALIZAR EL MÓDULO DE EVENTOS
// ==========================================

export function inicializarModuloEventos(contenedor) {

    if (!contenedor) {

        console.error("No se encontró el contenedor de eventos.");

        return;

    }


    // ==========================================
    // 2. GENERAR LA ESTRUCTURA HTML DEL MÓDULO
    // ==========================================

    contenedor.innerHTML = `

        <section class="seccion-filtro"
            id="seccion-eventos"
            aria-labelledby="titulo-eventos"
            hidden>

            <h2 class="seccion-filtro__titulo" id="titulo-eventos">
                Descubre los eventos top del año
            </h2>

            <form class="formulario-busqueda"
                action="#"
                method="get"
                role="search">

                <label class="formulario-busqueda__label"
                    for="buscar-evento">

                    Buscar evento:

                </label>

                <input
                    class="formulario-busqueda__input"
                    type="search"
                    id="buscar-evento"
                    name="q"
                    placeholder="Ej: Estadio Kempes, BTS..."
                >

                <fieldset class="formulario-busqueda__filtros">

                    <legend class="formulario-busqueda__leyenda">
                        Filtrar por:
                    </legend>

                    <label class="formulario-busqueda__opcion">

                        <input
                            type="radio"
                            name="filtro-evento"
                            value="popular"
                            checked
                        >

                        Popular

                    </label>

                    <label class="formulario-busqueda__opcion">

                        <input
                            type="radio"
                            name="filtro-evento"
                            value="artista"
                        >

                        Artista

                    </label>

                    <label class="formulario-busqueda__opcion">

                        <input
                            type="radio"
                            name="filtro-evento"
                            value="recinto"
                        >

                        Recinto

                    </label>

                    <label class="formulario-busqueda__opcion">

                        <input
                            type="radio"
                            name="filtro-evento"
                            value="fecha"
                        >

                        Fecha

                    </label>

                </fieldset>

            </form>

        </section>

        <section class="seccion-resultados"
            id="resultados-eventos"
            aria-labelledby="titulo-resultados"
            hidden>

            <h2 class="seccion-resultados__titulo"
                id="titulo-resultados">

                Resultados

            </h2>

            <div class="seccion-resultados__grilla"></div>

        </section>

    `;


    // ==========================================
    // 3. OBTENER LOS ELEMENTOS DEL HTML
    // ==========================================

    const seccionBusqueda = contenedor.querySelector(
        "#seccion-eventos"
    );

    const inputBusqueda = contenedor.querySelector(
        "#buscar-evento"
    );

    const filtros = contenedor.querySelectorAll(
        'input[name="filtro-evento"]'
    );

    const seccionResultados = contenedor.querySelector(
        "#resultados-eventos"
    );

    const grillaResultados = contenedor.querySelector(
        ".seccion-resultados__grilla"
    );


    // ==========================================
    // 4. CONECTAR EL MÓDULO DE RENDERIZADO
    // ==========================================

    function mostrarResultados(listaEventos) {

        renderizarEventos(
            listaEventos,
            grillaResultados,
            seccionResultados
        );

    }


    // ==========================================
    // 5. CONECTAR EL MÓDULO DE FILTRADO (ASÍNCRONO)
    // ==========================================

    async function aplicarFiltros() {

        const eventos = await obtenerEventos();

        filtrarEventos(
            eventos,
            contenedor,
            inputBusqueda,
            mostrarResultados,
            seccionResultados
        );

    }


    // ==========================================
    // 6. MOSTRAR EL MÓDULO DE EVENTOS
    // ==========================================

    async function mostrarModuloEventos() {

        seccionBusqueda.hidden = false;

        // Mostrar los eventos populares inicialmente
        await aplicarFiltros();

        seccionBusqueda.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    // ==========================================
    // 7. ESCUCHAR EL BUSCADOR Y LOS FILTROS
    // ==========================================

    inputBusqueda.addEventListener("input", async () => {
        await aplicarFiltros();
    });

    filtros.forEach(filtro => {

        filtro.addEventListener("change", async () => {
            await aplicarFiltros();
        });

    });


    // ==========================================
    // 8. GESTIONAR FAVORITOS Y ABRIR DETALLES
    // ==========================================

    grillaResultados.addEventListener("click", async (evento) => {

        if (!(evento.target instanceof Element)) {
            return;
        }

        // GESTIONAR FAVORITOS

        const botonFavorito = evento.target.closest(
            ".boton-favorito"
        );

        if (botonFavorito) {

            const id = Number(botonFavorito.dataset.eventoId);

            alternarFavorito(id);

            await aplicarFiltros();

            return;

        }


        // ABRIR DETALLES

        const botonDetalle = evento.target.closest(
            ".boton-ver-detalle-evento"
        );

        if (botonDetalle) {

            const id = botonDetalle.dataset.eventoId;

            contenedor.dispatchEvent(
                new CustomEvent("abrirDetalleEvento", {
                    detail: { id }
                })
            );

        }

    });


    // ==========================================
    // 9. ABRIR EL MÓDULO DESDE EL ENLACE
    // ==========================================

    document.addEventListener("click", async (evento) => {

        if (!(evento.target instanceof Element)) {
            return;
        }

        const enlace = evento.target.closest(
            'a[href="#seccion-eventos"]'
        );

        if (!enlace) {
            return;
        }

        evento.preventDefault();

        await mostrarModuloEventos();

    });


    // ==========================================
    // 10. COMPROBAR LA DIRECCIÓN DE NAVEGACIÓN
    // ==========================================

    if (window.location.hash === "#seccion-eventos") {

        mostrarModuloEventos();

    }

}