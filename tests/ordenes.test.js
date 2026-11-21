/*
node:test es el módulo nativo de Node.js para ejecutar pruebas unitarias
DESCRIBE: Agrupa pruebas relacionadas bajo un mismo título.
IT: Define un caso de prueba individual que se quiere ejecutar
*/
import { describe, it } from "node:test"; 

/*
ASSERT es un módulo nativo de Node.js para realizar afirmaciones en pruebas unitarias. 
Permite verificar que los resultados de las funciones sean los esperados. 
Si la afirmación falla, lanza un error y marca la prueba como fallida.
*/
import assert from "node:assert/strict";

//Importa las funciones a probar desde el archivo ordenes/ordenes.js
import { calcularNuevaReserva, calcularTotalCarrito} from "../ordenes/ordenes.js";

//PRUEBA DE: calcularNuevaReserva
describe("calcularNuevaReserva", function () {
    it("Si hay reserva nueva arranca en 1; si ya existe suma 1 y mantiene modalidad", function () {
        const sinReserva = calcularNuevaReserva(null, "domicilio");

        // Verifica que la reserva nueva tenga cantidad 1 y modalidad "domicilio"
        //deepStrictEqual compara objetos y arrays de manera profunda, asegurando que todas las propiedades y valores coincidan.
        assert.deepStrictEqual(sinReserva, {
            cantidad: 1,
            modalidad: "domicilio"
        });

        const conReserva = { cantidad: 2, modalidad: "estadio" };
        const sumada = calcularNuevaReserva(conReserva, "domicilio");
        assert.deepStrictEqual(sumada, {
            cantidad: 3,
            modalidad: "estadio"
        });
    });
});

//PRUEBA DE: calcularTotalCarrito
describe("calcularTotalCarrito", function () {
    it("suma precio * cantidad de cada ítem del carrito", function () {
        const carrito = [
            { precio: 5000, cantidad: 1 },
            { precio: 2500, cantidad: 2 }
        ];

        const total = calcularTotalCarrito(carrito);
        //strictEqual compara valores primitivos (números, strings, booleanos) y verifica que sean exactamente iguales.
        assert.strictEqual(total, 10000);
    });
});