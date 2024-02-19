const socket = io();

// Escuchar el evento 'updateProducts' del servidor
socket.on("updateProducts", (products) => {
  // products es la nueva lista de productos recibida desde el servidor
  console.log("Lista actualizada de productos:", products);

  updateProductList(products);
});

// Función para actualizar la lista de productos en la interfaz de usuario
function updateProductList(products) {
  console.log(
    "Interfaz actualizada con la nueva lista de productos:",
    products
  );
}

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

socket.on("message-all", (data) => {
  console.log(data);
  render(data);
});
const render = (data) => {
  const html = data
    .map((el) => {
      return `
      <div>
      <strong>${el.author}</strong> dice <em>${el.text}</em>
      </div>
      `;
    })
    .join(" ");
  document.getElementById("caja").innerHTML = html;
};
const addMessage = () => {
  const msg = {
    author: document.getElementById("name").value,
    text: document.getElementById("text").value,
  };
  socket.emit("new-message", msg);
  return false;
};
