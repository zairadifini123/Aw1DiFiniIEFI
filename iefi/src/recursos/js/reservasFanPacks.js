import { obtenerFanPacks } from "./datosFanPacks.js";


// ==========================================
// 1. BUSCAR UN FAN PACK
// ==========================================

export async function buscarFanPack(id) {
    const fanPacks = await obtenerFanPacks();
    return fanPacks.find(pack => pack.id === Number(id));
}


// ==========================================
// 2. OBTENER UNA RESERVA
// ==========================================

export async function obtenerReserva(id) {

    const pack = await buscarFanPack(id);

    if (!pack) {
        return null;
    }

    const datosGuardados = localStorage.getItem(
        `reservaFanPack_${pack.id}`
    );

    if (!datosGuardados) {
        return null;
    }

    const datos = datosGuardados.split("|");

    return {
        id: pack.id,
        nombre: pack.nombre,
        cantidad: Number(datos[0]),
        precio: Number(datos[1]),
        modalidad: datos[2] || "estadio"
    };

}


// ==========================================
// 3. OBTENER TODAS LAS RESERVAS
// ==========================================

export async function obtenerReservas() {

    const fanPacks = await obtenerFanPacks();
    const reservas = [];

    for (const pack of fanPacks) {
        const reserva = await obtenerReserva(pack.id);

        if (reserva && reserva.cantidad > 0) {
            reservas.push(reserva);
        }
    }

    return reservas;

}


// ==========================================
// 4. AGREGAR UN FAN PACK
// ==========================================

export async function agregarFanPack(id, modalidad = "estadio") {

    const pack = await buscarFanPack(id);

    if (!pack) {
        console.error("No se encontró el Fan Pack:", id);
        return null;
    }

    const reservaExistente = await obtenerReserva(pack.id);

    let cantidad = 1;

    let modalidadGuardada = modalidad;

    if (reservaExistente) {

        cantidad = reservaExistente.cantidad + 1;

        modalidadGuardada = reservaExistente.modalidad;

    }

    localStorage.setItem(
        `reservaFanPack_${pack.id}`,
        `${cantidad}|${pack.precio}|${modalidadGuardada}`
    );

    return await obtenerReserva(pack.id);

}


// ==========================================
// 5. QUITAR UN FAN PACK COMPLETO
// ==========================================

export async function quitarFanPack(id) {

    const pack = await buscarFanPack(id);

    if (!pack) {
        console.error("No se encontró el Fan Pack:", id);
        return;
    }

    localStorage.removeItem(`reservaFanPack_${pack.id}`);

}


// ==========================================
// 6. QUITAR UNA UNIDAD DE UN FAN PACK
// ==========================================

export async function quitarUnidadFanPack(id) {

    const reserva = await obtenerReserva(id);

    if (!reserva) {
        return;
    }

    if (reserva.cantidad <= 1) {

        await quitarFanPack(id);

        return;

    }

    localStorage.setItem(
        `reservaFanPack_${reserva.id}`,
        `${reserva.cantidad - 1}|${reserva.precio}|${reserva.modalidad}`
    );

}