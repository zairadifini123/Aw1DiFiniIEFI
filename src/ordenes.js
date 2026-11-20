/*
Extraído de agregarFanPack() en la gestión de reservas de Fan Packs.
Calcula la cantidad y modalidad de una reserva. Si ya existe
una reserva previa, suma 1 a su cantidad y conserva su modalidad; si no,
inicia con cantidad 1 y la modalidad indicada.
*/

export function calcularNuevaReserva(reservaExistente, modalidad = "estadio") {
    let cantidad = 1;
    let modalidadGuardada = modalidad;

    if (reservaExistente) {
        cantidad = reservaExistente.cantidad + 1;
        modalidadGuardada = reservaExistente.modalidad;
    }

    return {
        cantidad: cantidad,
        modalidad: modalidadGuardada
    };
}
/*
Extraído de renderizarCarrito() en la confirmación de pedido en carrito.js.
Recorre los ítems del carrito, calcula el subtotal de cada uno
(precio * cantidad) y acumula el total general sin depender del DOM.
*/

export function calcularTotalCarrito(itemsCarrito) {
    let totalGeneral = 0;

    for (let i = 0; i < itemsCarrito.length; i++) {
        const item = itemsCarrito[i];
        const subtotal = item.precio * item.cantidad;
        totalGeneral = totalGeneral + subtotal;
    }

    return totalGeneral;
}