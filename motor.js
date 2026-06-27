// Motor de búsqueda de ZaapStore
// Este archivo gestiona la lógica de búsqueda y redirección autónoma

async function buscarProductoEnTiempoReal(termino) {
    try {
        // Carga los productos desde tu archivo JSON
        const response = await fetch('productos.json');
        const productos = await response.json();
        
        // Filtra los productos sin revelar la fuente externa
        const busqueda = termino.toLowerCase();
        return productos.filter(p => 
            p.nombre.toLowerCase().includes(busqueda) || 
            p.categoria.toLowerCase().includes(busqueda)
        );
    } catch (error) {
        console.error("Error al acceder al inventario de ZaapStore:", error);
        return [];
    }
}

// Función de redirección que mantiene la fachada de ZaapStore
function adquirirProducto(urlDestino) {
    // Redirecciona al usuario al destino configurado en el JSON
    window.location.href = urlDestino;
}
