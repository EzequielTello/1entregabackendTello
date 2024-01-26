// handlebars.routes.js
import { Router } from "express";
import { ProductManager } from "../models/productManager.js";

const handlebarsRouter = Router();
const productManager = new ProductManager();

handlebarsRouter.get("/", async (req, res) => {
  const { limit } = req.query;
  const products = await productManager.getProducts();

  if (!limit) {
    res.render("home", { products });
  } else {
    const limitToInt = parseInt(limit);
    if (!isNaN(limitToInt) && limitToInt > 0) {
      const limitedProds = await productManager.getProducts(limitToInt);
      res.render("home", { products: limitedProds });
    } else {
      res.status(404).send({
        error: "Se ingresó mal el query param, tipo de dato incorrecto",
      });
    }
  }
});

//  ruta para la vista de productos en tiempo real
handlebarsRouter.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

export { handlebarsRouter };
