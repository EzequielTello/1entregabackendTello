import { Router } from "express";

const chatHandlebarsRouter = Router();

chatHandlebarsRouter.get("/", (req, res) => {
  res.render("chatHandlebars");
});

export { chatHandlebarsRouter };
