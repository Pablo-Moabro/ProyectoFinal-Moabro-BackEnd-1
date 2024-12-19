import express from "express";
import { config as configHandlebars } from "./config/handlebars.config.js";
import { config as configWebsocket } from "./config/websocket.config.js";
import { connectDB } from "./config/mongoose.config.js";

import routerProducts from "./routes/products.router.js";
import routerViewHome from "./routes/home.view.router.js";
import routerCarts from "./routes/carts.router.js";
import routerViewCart from "./routes/cart.view.router.js";



const app = express();
const PORT = 8080;

connectDB();

app.use("/api/public", express.static("./src/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configHandlebars(app);

app.use("/cart", routerViewCart);
app.use("/", routerViewHome);
app.use("/api/products", routerProducts);
app.use("/api/carts", routerCarts);

app.use("*", (req, res) => {
    res.status(404).render("error404", { title: "Error 404" });
});

const httpServer = app.listen(PORT, () => {
    console.log(`Ejecutándose en http://localhost:${PORT}`);
});

configWebsocket(httpServer);




