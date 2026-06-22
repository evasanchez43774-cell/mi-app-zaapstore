// =========================================================================
//           EL CEREBRO INTEGRADO DE PRECIOS Y LOGÍSTICA - ZAAPSTORE
// =========================================================================

// 1. SIMULACIÓN DE TU BODEGA LOCAL
let inventarioLocalPañales = {
    "Huggies Ultra Comfort": 0,
    "Huggies Supreme": 0,
    "BB Tips": 0
};

// 2. LÓGICA DE AJUSTE LOGÍSTICO (1 A 2 DÍAS)
function calcularFechaEntregaFinal(diasOriginales) {
    if (diasOriginales === 1) return 2;
    if (diasOriginales >= 3 && diasOriginales <= 4) return diasOriginales + 1;
    return diasOriginales + 2; // Para compras internacionales y otros
}

// 3. CAPA DE NORMALIZACIÓN (Ocultamiento de fuentes y limpieza)
function limpiarDatosProducto(productoAmazon) {
    return {
        nombre: productoAmazon.titulo,
        descripcion: productoAmazon.descripcion,
        imagenes: productoAmazon.galeria,
        vendedor: "ZaapStore",
        formaPago: "Aceptamos pagos locales en Zapotlanejo y transferencia segura."
    };
}

// 4. FUNCIÓN PRINCIPAL DE PROCESAMIENTO
async function procesarProductoParaCliente(productoAmazon, codigoProducto, quiereEnvioDomicilio) {
    let esPañalEspecial = ["Huggies Ultra Comfort", "Huggies Supreme", "BB Tips"].includes(codigoProducto);
    let esAbarrotesOSuper = productoAmazon.categoria === "abarrotes" || productoAmazon.categoria === "bebe";
    
    // Cálculo de costos y competencia (Regla C y B)
    let miCostoBase = productoAmazon.precioConDescuento;
    if (esPañalEspecial && productoAmazon.esCaja === true) miCostoBase /= 3;
    
    let precioFinalSugerido = miCostoBase + (productoAmazon.envioGratisProveedor ? 0 : productoAmazon.costoEnvioOriginal);
    if (quiereEnvioDomicilio) precioFinalSugerido += 20;

    // Calcular días ajustados
    let diasTotales = calcularFechaEntregaFinal(productoAmazon.diasEntregaOriginales);
    
    // Preparar datos limpios
    let datosLimpios = limpiarDatosProducto(productoAmazon);

    return {
        origen: productoAmazon.esPlaneyAhorra ? "AMAZON (PlaneyAhorra)" : "PROVEEDOR REGULAR",
        nombre: datosLimpios.nombre,
        descripcion: datosLimpios.descripcion,
        imagenes: datosLimpios.imagenes,
        precioFinal: precioFinalSugerido,
        entregaEstimada: `Tu pedido llegará en ${diasTotales} días a tu domicilio en Zapotlanejo.`,
        formaPago: datosLimpios.formaPago,
        nota: "Envío asegurado por ZaapStore",
        alertaAdmin: esPañalEspecial && inventarioLocalPañales[codigoProducto] > 0 ? "Venta de stock físico." : ""
    };
}
