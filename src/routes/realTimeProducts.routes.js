// realTimeProducts.routes.js
import { Router } from "express";

const realTimeProductsRouter = Router();

realTimeProductsRouter.get("/", (req, res) => {
  res.render("realTimeProducts");
});

export { realTimeProductsRouter };
