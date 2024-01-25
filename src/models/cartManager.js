import { promises as fs } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CARTS_PATH = join(__dirname, "../bd/carts.json");

class CartManager {
  generateCartId(carts) {
    const existingIds = carts.map((cart) => cart.id);
    let newId = 1;
    while (existingIds.includes(newId)) {
      newId++;
    }
    return newId;
  }

  // Get Cart
  async getCarts() {
    try {
      const content = await fs.readFile(CARTS_PATH, "utf-8");
      return JSON.parse(content);
    } catch (error) {
      console.log("Error al leer el carrito", error);
      return [];
    }
  }

  // Get Cart by id
  async getCartById(cartId) {
    try {
      await this.loadFromFile();
      const cart = await this.Carts.find((cart) => cart.id == cartId);
      return cart;
    } catch (error) {
      console.log("Error al leer el carrito", error);
      return [];
    }
  }
  // Create Cart
  async createCart() {
    try {
      const carts = await this.getCarts();
      const newCartId = this.generateCartId(carts);
      const newCart = {
        id: newCartId,
        products: [],
      };
      carts.push(newCart);
      await fs.writeFile(CARTS_PATH, JSON.stringify(carts, null, 2));
      return newCart;
    } catch (error) {
      console.error("Error al crear el acrrito", error);
      return null;
    }
  }
  //Delete cart by id
  async deleteCart(cartId) {
    try {
      const intCartId = parseInt(cartId);
      const carts = await this.getCarts();
      const cartIndex = carts.findIndex((cart) => cart.id === intCartId);

      if (cartIndex === -1) {
        console.log(`El carrito con el id: ${intCartId} no encontrado`);
        return false;
      } else {
        carts.splice(cartIndex, 1);
        await fs.writeFile(CARTS_PATH, JSON.stringify(carts, null, 2));
        return true;
      }
    } catch (error) {
      console.log(`Hubo un error al borrar el carrito ${error}`);
      return false;
    }
  }

  async addProductToCart(cartId, productId, quantity, products, carts) {
    try {
      const cartIndex = carts.findIndex((cart) => cart.id === cartId);

      if (cartIndex === -1) {
        carts.push({
          id: cartId,
          products: [],
        });
      }

      const product = products.find((prod) => prod.id === productId);

      if (!product) {
        console.log("Producto no encontrado.");
        return false;
      }

      const cart = carts[cartIndex];
      const existingProduct = cart.products.find(
        (prod) => prod.id === productId
      );

      if (existingProduct) {
        console.log("Producto existente:");
        existingProduct.quantity += parseInt(quantity);
        console.log("Cantidad del producto actualizada en el carrito.");
      } else {
        carts[cartIndex].products.push({
          id: parseInt(productId),
          quantity: parseInt(quantity),
        });
        console.log("Producto agregado al carrito.");
      }

      await fs.writeFile(CARTS_PATH, JSON.stringify(carts, null, 2));
      return true;
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      return false;
    }
  }
  // Eliminar productos del cart
  async removeProductFromCart(cartId, productId) {
    try {
      const carts = await this.getCarts();
      const cartIndex = carts.findIndex((cart) => cart.id === cartId);

      if (cartIndex === -1) {
        console.log("Carrito no encontrado.");
        return false;
      }

      const cart = carts[cartIndex];
      const productIndex = cart.products.findIndex(
        (prod) => prod.id === productId
      );

      if (productIndex === -1) {
        console.log("Producto no encontrado en el carrito.");
        return false;
      }

      cart.products.splice(productIndex, 1);
      await fs.writeFile(CARTS_PATH, JSON.stringify(carts, null, 2));

      return true;
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      return false;
    }
  }
  // Leer productos
  async getProductById(productId) {
    try {
      const content = await fs.readFile(PATH, "utf-8");
      const products = JSON.parse(content);
      return products.find((prod) => prod.id === productId);
    } catch (error) {
      console.error("No se leyeron los productos:", error);
      return null;
    }
  }

  async updateProductQuantity(cartId, productId, newQuantity) {
    try {
      const carts = await this.getCarts();

      const cartIndex = carts.findIndex((cart) => cart.id === cartId);

      if (cartIndex === -1) {
        console.log("Carrito no encontrado.");
        return false;
      }

      const cart = carts[cartIndex];
      const productIndex = cart.products.findIndex(
        (prod) => prod.id === productId
      );

      if (productIndex === -1) {
        console.log("Producto no encontrado en el carrito.");
        return false;
      }

      cart.products[productIndex].quantity = parseInt(newQuantity);
      await fs.writeFile(CARTS_PATH, JSON.stringify(carts, null, 2));

      return true;
    } catch (error) {
      console.error("Error al actualizar la cantidad del producto:", error);
      return false;
    }
  }
}
export { CartManager, CARTS_PATH };
