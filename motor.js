// Los comandos (async, function, return) están en inglés porque son lenguaje de programación
// Los nombres (buscarProducto, categoria) están en español porque tú los elegiste así
async function buscarProductoEnTiempoReal(termino) {
    try {
        const respuesta = await fetch('productos.json');
        const productos = await respuesta.json();
        
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

function adquirirProducto(urlDestino) {
    window.location.href = urlDestino;
}
