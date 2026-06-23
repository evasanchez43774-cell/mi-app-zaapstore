// =========================================================================
// CEREBRO INTEGRADO Y BUSCADOR INFINITO - ZAAPSTORE
// =========================================================================

// Configuración de conexión segura
const apiKey = process.env.SCRAPER_API_KEY;

// 1. FUNCIÓN DE CONEXIÓN A SCRAPERAPI (Núcleo de rastreo)
async function llamarServicioScraper(url) {
    const urlFinal = `http://api.scraperapi.com?api_key=${apiKey}&url=${encodeURIComponent(url)}`;
    const respuesta = await fetch(urlFinal);
    return await respuesta.json();
}

// 2. BUSCADOR INTELIGENTE - ZAAPSTORE (Integración Invisible)
// Esta función reemplaza la búsqueda manual por una búsqueda dinámica en catálogos externos
async function buscarProductoEnTiempoReal(terminoBusqueda) {
    // Construcción de la URL de búsqueda dinámica
    const urlBusqueda = "https://www.amazon.com.mx/s?k=" + encodeURIComponent(terminoBusqueda);
    
    // Llamada al scraper con el término de búsqueda
    const resultadosBrutos = await llamarServicioScraper(urlBusqueda);
    
    // 3. CAPA DE NORMALIZACIÓN Y MÁSCARA DE MARCA
    // Convierte resultados brutos en un catálogo limpio para ZaapStore
    const listaLimpia = resultadosBrutos.map(item => {
        return {
            nombre: item.Título || "Producto ZaapStore",
            precio: item.precioConDescuento || "Consultar en tienda",
            imagen: item.Imagen,
            vendedor: "ZaapStore (Zapotlanejo)", // Mascara de marca para el cliente
            formaPago: "Aceptamos pagos locales en Zapotlanejo y transferencia segura.",
            nota: "Envío asegurado por ZaapStore. Disponibilidad sujeta a inventario."
        };
    });
    
    return listaLimpia;
}

// 4. LÓGICA DE BODEGA LOCAL Y AJUSTE LOGÍSTICO
const inventarioLocalPañales = {
    "Huggies Ultra Comfort": 0,
    "Huggies Supreme": 0,
    "Consejos BB": 0
};

function calcularFechaEntregaFinal(diasOriginales) {
    if (diasOriginales <= 1) return 2;
    if (diasOriginales >= 3 && diasOriginales <= 4) return diasOriginales + 1;
    return diasOriginales + 2;
}

// 5. CAPA DE NORMALIZACIÓN Y LIMPIEZA
// Asegura que ninguna referencia externa llegue al usuario final
function normalizarParaCliente(producto) {
    return {
        ...producto,
        origen: "ZaapStore Catalog",
        garantia: "Garantía directa con ZaapStore Zapotlanejo"
    };
}
