// ==========================================
// IMPORTACIONES
// ==========================================

import { obtenerFanPacks } from "./datosFanPacks.js";
import {
    obtenerReservas,
    quitarFanPack
} from "./reservasFanPacks.js";


// ==========================================
// REFERENCIAS AL DOM
// ==========================================

const grillaCarrito = document.querySelector("#grilla-carrito");
const carritoTotalMonto = document.querySelector("#carrito-total-monto");
const notificacionCarrito = document.querySelector("#notificacion-carrito");
const btnConfirmarWhatsapp = document.querySelector("#btn-confirmar-whatsapp");
const btnConfirmarEmail = document.querySelector("#btn-confirmar-email");


// ==========================================
// MOSTRAR NOTIFICACIÓN EN LA INTERFAZ
// ==========================================

function mostrarNotificacion(mensaje, esError) {
    if (!notificacionCarrito) {
        return;
    }

    notificacionCarrito.textContent = mensaje;
    notificacionCarrito.style.display = "block";

    if (esError === true) {
        notificacionCarrito.className = "carrito-notificacion carrito-notificacion--error";
    } else {
        notificacionCarrito.className = "carrito-notificacion carrito-notificacion--exito";
    }

    setTimeout(function () {
        notificacionCarrito.style.display = "none";
    }, 4000);
}


// ==========================================
// RENDERIZAR EL CARRITO VISUALMENTE
// ==========================================

async function renderizarCarrito() {
    if (!grillaCarrito) {
        return;
    }

    const reservas = await obtenerReservas();

    if (reservas.length === 0) {
        grillaCarrito.innerHTML = `
            <li class="carrito-vacio">
                <p class="carrito-vacio__texto">
                    Tu carrito está vacío. Explorá los artistas para agregar Fan Packs. 🎸
                </p>
                <a href="./artistas.html" class="carrito-boton-accion">
                    Ver catálogo de artistas
                </a>
            </li>
        `;

        if (carritoTotalMonto) {
            carritoTotalMonto.textContent = "$0";
        }
        return;
    }

    const catalogoFanPacks = await obtenerFanPacks();
    let totalGeneral = 0;
    let htmlTarjetas = "";

    for (let i = 0; i < reservas.length; i++) {
        const reserva = reservas[i];
        let packCompleto = null;

        for (let j = 0; j < catalogoFanPacks.length; j++) {
            if (catalogoFanPacks[j].id === Number(reserva.id)) {
                packCompleto = catalogoFanPacks[j];
                break;
            }
        }

        let imagen = "./recursos/imagenes/logos/soundday_white.png";
        let artista = "Artista oficial";
        let descripcion = "";

        if (packCompleto !== null) {
            imagen = packCompleto.imagen;
            artista = packCompleto.artista;
            descripcion = packCompleto.descripcion;
        }

        let modalidadTexto = "Retiro en estadio (Día del show)";
        if (reserva.modalidad === "domicilio") {
            modalidadTexto = "Envío postal a domicilio";
        }

        const subtotal = reserva.precio * reserva.cantidad;
        totalGeneral = totalGeneral + subtotal;

        htmlTarjetas = htmlTarjetas + `
            <li class="carrito-item">
                <div>
                    <figure class="carrito-item__marco">
                        <img
                            class="carrito-item__imagen"
                            src="${imagen}"
                            alt="Fan Pack ${reserva.nombre}"
                        >
                    </figure>

                    <h3 class="carrito-item__subtitulo">
                        ${reserva.nombre}
                    </h3>

                    <p class="carrito-item__texto">
                        <strong>Artista:</strong> ${artista}
                    </p>

                    <p class="carrito-item__texto">
                        ${descripcion}
                    </p>

                    <p class="carrito-item__texto">
                        <strong>Modalidad:</strong> ${modalidadTexto}
                    </p>

                    <p class="carrito-item__texto">
                        <strong>Cantidad:</strong> ${reserva.cantidad} un.
                    </p>

                    <p class="carrito-item__subtotal">
                        Subtotal: $${subtotal.toLocaleString("es-AR")}
                    </p>
                </div>

                <button
                    class="carrito-boton-quitar"
                    type="button"
                    data-pack-id="${reserva.id}"
                >
                    Sacar de carrito
                </button>
            </li>
        `;
    }

    grillaCarrito.innerHTML = htmlTarjetas;

    if (carritoTotalMonto) {
        carritoTotalMonto.textContent = "$" + totalGeneral.toLocaleString("es-AR");
    }

    const botonesQuitar = document.querySelectorAll(".carrito-boton-quitar");

    for (let i = 0; i < botonesQuitar.length; i++) {
        botonesQuitar[i].addEventListener("click", async function () {
            const idPack = Number(this.getAttribute("data-pack-id"));
            await quitarFanPack(idPack);
            await renderizarCarrito();
            mostrarNotificacion("Se ha quitado el Fan Pack del carrito.", false);
        });
    }
}


// ==========================================
// CONFIRMAR PEDIDO POR WHATSAPP
// ==========================================

// ==========================================
// CONFIRMAR PEDIDO POR GMAIL (WEB)
// ==========================================

async function confirmarPedidoGmail() {
    const reservas = await obtenerReservas();

    if (reservas.length === 0) {
        mostrarNotificacion("No tenés Fan Packs en el carrito para confirmar.", true);
        return;
    }

    const catalogoFanPacks = await obtenerFanPacks();
    let total = 0;

    let mensajeFicha = "Hola SoundDay! Quiero confirmar mi pedido:\n\n";

    for (let i = 0; i < reservas.length; i++) {
        const item = reservas[i];
        let packCompleto = null;

        for (let j = 0; j < catalogoFanPacks.length; j++) {
            if (catalogoFanPacks[j].id === Number(item.id)) {
                packCompleto = catalogoFanPacks[j];
                break;
            }
        }

        let artista = "Artista oficial";
        if (packCompleto !== null) {
            artista = packCompleto.artista;
        }

        let modalidadTexto = "Retiro en estadio (Día del show)";
        if (item.modalidad === "domicilio") {
            modalidadTexto = "Envío postal a domicilio";
        }

        const subtotal = item.precio * item.cantidad;
        total = total + subtotal;

        mensajeFicha = mensajeFicha + "- " + item.nombre + "\n";
        mensajeFicha = mensajeFicha + "  Artista: " + artista + "\n";
        mensajeFicha = mensajeFicha + "  Modalidad: " + modalidadTexto + "\n";
        mensajeFicha = mensajeFicha + "  Cantidad: " + item.cantidad + " un.\n";
        mensajeFicha = mensajeFicha + "  Subtotal: $" + subtotal.toLocaleString("es-AR") + "\n\n";
    }

    mensajeFicha = mensajeFicha + "TOTAL GENERAL A ABONAR: $" + total.toLocaleString("es-AR");

    // Datos específicos para Gmail Web
    const correoDestino = "pedidos@soundday.com.ar";
    const asunto = "Confirmación de Pedido - SoundDay";
    
    // URL oficial de Gmail para redactar un mensaje nuevo pasando los parámetros codificados
    const urlGmail = "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(correoDestino) + "&su=" + encodeURIComponent(asunto) + "&body=" + encodeURIComponent(mensajeFicha);

    mostrarNotificacion("Ficha preparada. Abriendo Gmail...", false);

    setTimeout(function () {
        window.open(urlGmail, "_blank");
    }, 1000);
}

if (btnConfirmarEmail) {
    btnConfirmarEmail.addEventListener("click", function () {
        confirmarPedidoGmail();
    });
}


// ==========================================
// INICIALIZACIÓN
// ==========================================

renderizarCarrito();