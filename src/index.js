import express from "express";
import { prodRouter } from "./routes/products.routes.js";
import { cartRouter } from "./routes/cart.routes.js";
import http from "http";
import { Server } from "socket.io";
import expressHandlebars from "express-handlebars";
import { handlebarsRouter } from "./routes/handlebars.routes.js";
import { realTimeProductsRouter } from "./routes/realTimeProducts.routes.js";

const PORT = 8080;
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const hbs = expressHandlebars.create({
  extname: "handlebars",
  defaultLayout: "main",
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./views");

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
