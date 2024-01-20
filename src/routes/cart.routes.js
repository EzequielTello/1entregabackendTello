import { Router } from "express";
import { CartManager, CARTS_PATH } from "../models/cartManager.js";
import { promises as fs } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PATH = join(__dirname, "../bd/products.json");

const cartRouter = Router();
const cartManager = new CartManager();

// Crear cart
cartRouter.post("/", async (_req, res) => {
  const validate = await cartManager.createCart();

  if (validate) {
    res.status(200).send("Carrito creado con éxito");
  } else {
    res.status(400).send("Error al crear carrito");
  }
});

// Eliminar cart
cartRouter.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  const validate = await cartManager.deleteCart(parseInt(cid));

  if (validate) {
    res.status(200).send(`Carrito eliminado correctamente`);
  } else {
    res.status(400).send(`Error al eliminar el carrito`);
  }
});

// Solicitar Cart by Id
cartRouter.get("/:cid", async (req, res) => {
  const cid = req.params.id;
  const cart = await cartManager.getCartById(parseInt(cid));

  if (cart) {
    res.status(200).send(cart);
  } else {
    res
      .status(404)
      .send("El carrito con el id: " + cid + " no se ha encontrado");
  }
});

// Agregar productos al cart
cartRouter.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const productsContent = await fs.readFile(PATH, "utf-8");
    const products = JSON.parse(productsContent);

    const cartsContent = await fs.readFile(CARTS_PATH, "utf-8");
    if (!cartsContent.trim()) {
      // Si el contenido está vacío, inicializa el archivo con una estructura JSON válida
      const initialData = [];
      await fs.writeFile(CARTS_PATH, JSON.stringify(initialData, null, 2));
      console.log(
        "El archivo de carritos estaba vacío y se inicializó con datos."
      );
      return res
        .status(404)
        .send("No se encontraron datos en el archivo de carritos");
    }

    let carts = JSON.parse(cartsContent);
    console.log("Datos del carrito leídos:", carts);

    const cartIndex = carts.findIndex((cart) => cart.id === parseInt(cid));

    if (cartIndex === -1) {
      carts.push({
        id: parseInt(cid),
        products: [],
      });
    }
    const success = await cartManager.addProductToCart(
      parseInt(cid),
      parseInt(pid),
      quantity,
      products,
      carts
    );

    if (!success) {
      res.status(404).send("Carrito no creado");
    } else {
      res
        .status(200)
        .send(`Producto con id: ${pid} agregado al carrito con id: ${cid}`);
    }
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Eliminar producto del cart
cartRouter.delete("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  const success = await cartManager.removeProductFromCart(
    parseInt(cid),
    parseInt(pid)
  );

  if (!success) {
    return res.status(404).send("No se pudo eliminar el producto del carrito");
  } else {
    res
      .status(200)
      .send(`Producto con id: ${pid} eliminado del carrito con id: ${cid}`);
  }
});

// Actualizar cantidad de un cart
cartRouter.put("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  const success = await cartManager.updateProductQuantity(
    parseInt(cid),
    parseInt(pid),
    quantity
  );

  if (!success) {
    return res
      .status(404)
      .send("No se pudo actualizar la cantidad del producto en el carrito");
  } else {
    res
      .status(200)
      .send(
        `Cantidad del producto con id: ${pid} en el carrito con id: ${cid} actualizada`
      );
  }
});

export { cartRouter };
