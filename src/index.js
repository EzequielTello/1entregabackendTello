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

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("Usuario conectado");

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
});

app.use("/api/products", prodRouter);
app.use("/api/carts", cartRouter);
app.use("/", handlebarsRouter);
app.use("/realtimeproducts", realTimeProductsRouter);

server.listen(PORT, () => {
  console.log(`Server on port: ${PORT}`);
});
