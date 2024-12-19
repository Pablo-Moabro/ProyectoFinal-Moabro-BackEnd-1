import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager();

router.get("/", async (req, res) => {
    try {
        const carts = await cartManager.getAll(req.query);
        res.status(200).json({ status: "success", payload: carts });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const cart = await cartManager.getOneById(req.params.id);
        res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});


//Crea el carrito
router.post("/", async (req, res) => {
    try {
        const cart = await cartManager.insertOne(req.body);
        res.status(201).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

//Agrega productos al carrito ya existente o modificia la cantidad de unidades
router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const cart = await cartManager.addOneProduct(cid, pid, quantity);
        res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

//Elimina el producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartManager.deleteProductFromCart(cid, pid);
        res.status(200).json({ status: "success", payload: "Producto eliminado:", cart });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

//Elimina todos los productos del carrito
router.delete("/:cid/products", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.deleteAllProductFromCart(cid);
        res.status(200).json({ status: "success", payload: "Producto eliminado:", cart });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

//Elimina el carrito
router.delete("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const {message} = await cartManager.deleteCart(cid);
        res.status(200).json({ status: "success", message });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});


export default router;


