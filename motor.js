async function buscarProductoEnTiempoReal(termino) {
    try {
        const response = await fetch('productos.json');
        const productos = await response.json();
        
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
