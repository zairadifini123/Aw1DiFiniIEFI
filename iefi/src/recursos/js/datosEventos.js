import { URL_EVENTOS } from "./config.js";

// Obtener eventos desde el JSON
export async function obtenerEventos() {
    try {
        const respuesta = await fetch(URL_EVENTOS);
        
        if (!respuesta.ok) {
            throw new Error(`Error en la red: ${respuesta.status}`);
        }
        
        const datos = await respuesta.json();
        return datos;

    } catch (error) {
        console.error("Hubo un error al obtener los eventos:", error);
        return [];
    }
}