// Motor de búsqueda de ZaapStore - Enmascarador de origen
async function buscarProductoEnTiempoReal(termino) {
    try {
        const respuesta = await fetch('productos.json');
        const productos = await respuesta.json();
        
        // Filtramos productos ocultando la fuente original
        const busqueda = termino.toLowerCase();
        return productos.filter(p => 
            p.nombre.toLowerCase().includes(busqueda) || 
            p.categoria.toLowerCase().includes(busqueda)
        );
    } catch (error) {
        console.error("Error al conectar con la base de datos de ZaapStore:", error);
        return [];
    }
}

// Función que redirige al usuario manteniendo la fachada de ZaapStore
function adquirirProducto(urlDestino) {
    // Aquí puedes añadir un mensaje de "Redirigiendo a almacén..." si deseas
    window.location.href = urlDestino;
}
