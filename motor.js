// =================================================================
//           EL CEREBRO INTEGRADO DE PRECIOS - ZAAPSTORE
// =================================================================

// 1. SIMULACIÓN DE TU BODEGA LOCAL EN ZAPOTLANEJO
// Registra cuántos paquetes físicos tienes sueltos en tu tienda.
let inventarioLocalPañales = {
    "Huggies Ultra Comfort": 0,
    "Huggies Supreme": 0,
    "BB Tips": 0
};

// 2. FUNCIÓN PRINCIPAL: PROCESAR CADA PRODUCTO EN LA BÚSQUEDA
async function procesarProductoParaCliente(productoAmazon, codigoProducto, quiereEnvioDomicilio) {
    let esPañalEspecial = ["Huggies Ultra Comfort", "Huggies Supreme", "BB Tips"].includes(codigoProducto);
    let esAbarrotesOSuper = productoAmazon.categoria === "abarrotes" || productoAmazon.categoria === "bebe";

    // --- REGLA A: CONTROL DE STOCK LOCAL (PAÑALES ESPECIALES) ---
    if (esPañalEspecial && inventarioLocalPañales[codigoProducto] > 0) {
        // Si te quedan paquetes físicos en tienda, se venden esos primero al precio competitivo guardado
        let precioFijoLocal = productoAmazon.ultimoPrecioCalculado || 140; 
        return {
            origen: "TIENDA FÍSICA",
            precioFinal: precioFijoLocal + (quiereEnvioDomicilio ? 20 : 0),
            textoVisual: "¡Disponible para entrega inmediata en tienda!",
            alertaAdmin: "Venta de stock físico. Restar 1 paquete del inventario local."
        };
    }

    // --- REGLA B: BASE DE COSTO (CONVERTIR CAJA A PAQUETE SI APLICA) ---
    let miCostoBase = productoAmazon.precioConDescuento; // Tu precio con Planea y Ahorra
    if (esPañalEspecial && productoAmazon.esCaja === true) {
        miCostoBase = miCostoBase / 3; // Dividimos el costo de la caja entre 3 paquetes
    }

    // --- REGLA C: COMPARACIÓN EN VIVO CON LA COMPETENCIA ---
    let precioFinalSugerido = 0;
    let notaBusqueda = "";

    if (productoAmazon.esPlaneaYAhorra && (esPañalEspecial || esAbarrotesOSuper)) {
        // El sistema consulta en tiempo real las páginas de los rivales
        let precioWalmart = await rastrearPrecioWalmart(codigoProducto);
        let precioFarmaciaGuadalajara = await rastrearPrecioFarmaciaGuadalajara(codigoProducto);
        
        // Encontrando el precio más bajo del mercado hoy
        let precioMasBajoCompetencia = Math.min(precioWalmart, precioFarmaciaGuadalajara);
        
        // Estrategia: Ponemos el precio $10 pesos más barato que la competencia
        precioFinalSugerido = precioMasBajoCompetencia - 10;

        // CANDADO DE SEGURIDAD: Validar que te deje una ganancia justa (Mínimo $25 pesos)
        let gananciaEstimada = precioFinalSugerido - miCostoBase;
        let gananciaMinimaAceptable = 25;

        if (gananciaEstimada < gananciaMinimaAceptable) {
            // Si la competencia está regalando el producto, el sistema te protege usando tu margen seguro
            precioFinalSugerido = miCostoBase + gananciaMinimaAceptable;
            notaBusqueda = "Precio protegido: Margen mínimo asegurado sobre tu costo.";
        } else {
            notaBusqueda = "Precio optimizado: Más barato que Walmart y Farmacia Gdl.";
        }
    } else {
        // Si NO es de Planea y Ahorra ni pañal especial, aplica la tabla de comisiones normal
        let comisionFija = 0;
        if (miCostoBase < 300) comisionFija = 20;
        else if (miCostoBase >= 300 && miCostoBase <= 800) comisionFija = 35;
        else comisionFija = 50;

        precioFinalSugerido = miCostoBase + comisionFija;
        notaBusqueda = "Precio regular con comisión fija aplicada.";
    }

    // --- REGLA D: MANEJO DE ENVÍOS ORIGINALES Y LOCALES ---
    // Si el proveedor original cobra envío, se le traslada el costo real al cliente
    if (productoAmazon.envioGratisProveedor === false) {
        precioFinalSugerido += productoAmazon.costoEnvioOriginal;
    }

    // Si el cliente pide llevarlo a su casa en la comunidad, se suman los $20 pesos
    if (quiereEnvioDomicilio) {
        precioFinalSugerido += 20;
    }

    // --- RESPUESTA FINAL DEL CEREBRO ---
    return {
        origen: productoAmazon.esPlaneaYAhorra ? "AMAZON (Planea y Ahorra)" : "PROVEEDOR REGULAR",
        precioFinal: precioFinalSugerido,
        textoVisual: esPañalEspecial ? "Paquete Individual (Súper Precio)" : productAmazon.nombre,
        nota: notaBusqueda,
        requiereCancelarEnAmazon: productoAmazon.esPlaneaYAhorra ? true : false,
        alertaAdmin: esPañalEspecial ? "Al venderse, compra la caja en Amazon y guarda los otros 2 paquetes en stock físico." : ""
    };
}

// 3. ORDENAR DE MENOR A MAYOR PRECIO AUTOMÁTICAMENTE
function ordenarResultadosZaapStore(listaProductos) {
    return listaProductos.sort((a, b) => a.precioFinal - b.precioFinal);
}
