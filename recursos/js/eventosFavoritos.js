
 // ==========================================
 // 1. OBTENER LOS EVENTOS FAVORITOS
 // ==========================================

export function obtenerFavoritos() {

    const favoritosGuardados = localStorage.getItem("eventosFavoritos");

    if (!favoritosGuardados) {
        return [];
    }

    return favoritosGuardados
        .split(",")
        .map(Number)
        .filter(id => !isNaN(id));

}


// ==========================================
// 2. COMPROBAR SI UN EVENTO ESTÁ GUARDADO
// ==========================================

export function estaGuardado(id) {

    const favoritos = obtenerFavoritos();

    return favoritos.includes(Number(id));

}


// ==========================================
// 3. GUARDAR O ELIMINAR UN EVENTO
// ==========================================

export function alternarFavorito(id) {

    const favoritos = obtenerFavoritos();

    const identificador = Number(id);

    const indiceFavorito = favoritos.indexOf(identificador);

    if (indiceFavorito === -1) {

        favoritos.push(identificador);

    } else {

        favoritos.splice(indiceFavorito, 1);

    }

    localStorage.setItem(
        "eventosFavoritos",
        favoritos.join(",")
    );

    // Avisar que se modificaron los favoritos
    window.dispatchEvent(
        new Event("favoritosActualizados")
    );

    return favoritos;

}
