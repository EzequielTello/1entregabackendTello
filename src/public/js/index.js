const socket = io();

// Escuchar el evento 'updateProducts' del servidor
socket.on("updateProducts", (products) => {
  // products es la nueva lista de productos recibida desde el servidor
  console.log("Lista actualizada de productos:", products);

  // Aquí puedes actualizar tu interfaz de usuario con la nueva lista de productos
  // Por ejemplo, podrías renderizar una tabla HTML con los productos
  updateProductList(products);
});

// Función para actualizar la lista de productos en la interfaz de usuario
function updateProductList(products) {
  // Implementa la lógica para actualizar la interfaz aquí
  // Por ejemplo, puedes usar DOM manipulation o cualquier framework que estés utilizando
  // Ejemplo básico: actualiza la consola del navegador
  console.log(
    "Interfaz actualizada con la nueva lista de productos:",
    products
  );
}

// Resto de tu código existente...
document
  .getElementById("productForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const quantity = document.getElementById("quantity").value;

    // Un nuevo producto
    socket.emit("newProduct", { title, description, price, quantity });
  });
