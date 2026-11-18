
// ==========================================
// 1. FILTRAR Y ORDENAR EVENTOS
// ==========================================

export function filtrarEventos(eventos, contenedor, inputBusqueda, mostrarResultados, seccionResultados) {

    // Obtener el filtro seleccionado
    const filtroSeleccionado = contenedor.querySelector(
        'input[name="filtro-evento"]:checked'
    );

    // Obtener el texto ingresado
    const textoBusqueda = inputBusqueda.value
        .toLowerCase()
        .trim();

    // Comprobar que exista un filtro seleccionado
    if (!filtroSeleccionado) {

        seccionResultados.hidden = true;

        return;

    }

    const tipoFiltro = filtroSeleccionado.value;

    let eventosFiltrados = [];


    // ==========================================
    // 2. FILTRAR POR POPULARIDAD
    // ==========================================

    if (tipoFiltro === "popular") {

        eventosFiltrados = [...eventos].sort(
            (a, b) => b.interesados - a.interesados
        );

    }


    // ==========================================
    // 3. FILTRAR POR ARTISTA
    // ==========================================

    else if (tipoFiltro === "artista") {

        eventosFiltrados = eventos.filter(evento => {

            return evento.artista
                .toLowerCase()
                .includes(textoBusqueda);

        });

    }


    // ==========================================
    // 4. FILTRAR POR RECINTO
    // ==========================================

    else if (tipoFiltro === "recinto") {

        eventosFiltrados = eventos.filter(evento => {

            return evento.recinto
                .toLowerCase()
                .includes(textoBusqueda);

        });

    }


    // ==========================================
    // 5. FILTRAR POR FECHA
    // ==========================================

    else if (tipoFiltro === "fecha") {

        eventosFiltrados = eventos.filter(evento => {

            return evento.fecha
                .toLowerCase()
                .includes(textoBusqueda);

        });

    }


    // ==========================================
    // 6. MOSTRAR LOS RESULTADOS
    // ==========================================

    mostrarResultados(eventosFiltrados);

}
