
// ==========================================
// GESTIÓN DE ARTISTAS SEGUIDOS
// ==========================================

// Obtener los artistas seguidos
export function obtenerArtistasSeguidos() {

    const seguidosGuardados = localStorage.getItem("artistasSeguidos");

    if (!seguidosGuardados) {
        return [];
    }

    return seguidosGuardados.split("|");

}


// Verificar si un artista está seguido
export function estaSiguiendo(nombreArtista) {

    const seguidos = obtenerArtistasSeguidos();

    return seguidos.includes(nombreArtista);

}


// Alternar el seguimiento de un artista
export function alternarSeguimiento(nombreArtista) {

    const seguidos = obtenerArtistasSeguidos();

    const indice = seguidos.indexOf(nombreArtista);

    if (indice === -1) {

        seguidos.push(nombreArtista);

    } else {

        seguidos.splice(indice, 1);

    }

    localStorage.setItem(
        "artistasSeguidos",
        seguidos.join("|")
    );

    return seguidos;

}
