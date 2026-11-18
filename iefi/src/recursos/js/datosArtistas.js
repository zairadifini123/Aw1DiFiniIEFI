import { URL_ARTISTAS } from "./config.js";

// Obtener artistas desde el JSON
export async function obtenerArtistas() {
    try {
        const respuesta = await fetch(URL_ARTISTAS);
        
        if (!respuesta.ok) {
            throw new Error(`Error en la red: ${respuesta.status}`);
        }
        
        const datos = await respuesta.json();
        return datos;

    } catch (error) {
        console.error("Hubo un error al obtener los artistas:", error);
        return [];
    }
}