import { URL_FANPACKS } from "./config.js";

// Función asíncrona para obtener los Fan Packs desde el JSON externo con try/catch
export async function obtenerFanPacks() {
    try {
        const respuesta = await fetch(URL_FANPACKS);
        
        if (!respuesta.ok) {
            throw new Error(`Error en la red: ${respuesta.status}`);
        }
        
        const datos = await respuesta.json();
        return datos;

    } catch (error) {
        console.error("Hubo un error al obtener los fan packs:", error);
        return []; // Retorna un arreglo vacío si falla para no romper la app
    }
} 