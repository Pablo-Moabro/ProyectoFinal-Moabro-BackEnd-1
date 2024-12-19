import { Router } from "express";

const router = Router();

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params.id;
        res.render("cart", { title: "Carrito" });
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});

export default router;