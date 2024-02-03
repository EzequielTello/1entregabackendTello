import express from "express";
import { prodRouter } from "./routes/products.routes.js";
import { cartRouter } from "./routes/cart.routes.js";
import http from "http";
import { Server } from "socket.io";
import { handlebarsRouter } from "./routes/handlebars.routes.js";
import { realTimeProductsRouter } from "./routes/realTimeProducts.routes.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { engine } from "express-handlebars";
import { promises as fs } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 8080;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.engine(
  "handlebars",
  engine({ extname: ".handlebars", defaultLayout: false })
);
app.set("view engine", "handlebars");
app.set("views", join(__dirname, "views"));

let products = [];

const loadProducts = async () => {
  try {
    const productsContent = await fs.readFile(
      join(__dirname, "bd", "products.json"),
      "utf-8"
    );
    products = JSON.parse(productsContent);
  } catch (error) {
    console.error("Error al cargar los productos:", error);
  }
};

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("Usuario conectado");

  socket.emit("updateProducts", products);

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
  socket.on("newProduct", (newProduct) => {
    products.push(newProduct);
    console.log("Nuevo producto recibido:", newProduct);
    io.emit("updateProducts", products);
  });
});

app.use("/api/products", prodRouter);
app.use("/api/carts", cartRouter);
app.use("/", handlebarsRouter);
app.use("/realtimeproducts", realTimeProductsRouter);

loadProducts();

server.listen(PORT, () => {
  console.log(`Server on port: ${PORT}`);
});
