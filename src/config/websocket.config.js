import { Server } from "socket.io";
import ProductsManager from "../managers/ProductsManager.js";
import CartManager from "../managers/CartManager.js";



const productsManager = new ProductsManager();
const cartManager = new CartManager();

export const config = (httpServer) => {

    const socketServer = new Server(httpServer);

    socketServer.on("connection", async (socket) => {
        console.log("Nuevo cliente conectado");


        const initialProducts = await productsManager.getAll()
        socketServer.emit("products-list", { products: initialProducts.docs || initialProducts });

        const cartId = "675c82b2d139067074d4e144";
    console.log("Emitiendo carrito inicial con cartId:", cartId);

    try {
        const cart = await cartManager.getOneById(cartId);

        // Emitir los productos al cliente recién conectado
        socket.emit("cart-updated", { products: cart.products });
    } catch (error) {
        console.error("Error recuperando carrito al conectar:", error.message);
        socket.emit("cart-error", { message: "Error al cargar el carrito." });
    }
        
        
        socket.on("insert-product", async (data) =>{
            try {
                await productsManager.insertOne(data);
                const updatedProducts = await productsManager.getAll();
                socketServer.emit("products-list", { products: updatedProducts.docs || updatedProducts })
            } catch (error) {
                socketServer.emit("error-message", { message: error.message })
            }
        });

        socket.on("delete-product", async (data) =>{
            try {
                await productsManager.deleteOneById(data.id);
                const updatedProducts = await productsManager.getAll();
                socketServer.emit("products-list", { products: updatedProducts.docs })
            } catch (error) {
                socketServer.emit("error-message", { message: error.message })
            }
        });

        
        
        

        

        //Agregar al carrito
        socket.on("add-to-cart", async ({ cartId, productId }) => {
            try {
                const updatedCart = await cartManager.addOneProduct(cartId, productId);
                const cartProducts = updatedCart.products;
                socketServer.emit("cart-updated", { products: cartProducts });
            } catch (error) {
                console.error("Error agregando producto al carrito:", error.message);
                socket.emit("cart-error", { message: error.message });
            }
        });
        

         // Actualizar el carrito tras un cambio
         socket.on("update-cart", async (cartId) => {
            try {
                const updatedCart = await cartManager.getOneById(cartId);
                socketServer.emit("cart-updated", { products: updatedCart.products });
            } catch (error) {
                console.error("Error actualizando carrito:", error.message);
                socket.emit("cart-error", { message: error.message });
            }
        });

        //Eliminar del carritto
        socket.on("delete-product-from-cart", async (data) => {
            const { cartId, productId } = data;
        
            try {
                // Llamar al CartManager para eliminar el producto
                await cartManager.deleteProductFromCart(cartId, productId);
        
                // Emitir los productos actualizados del carrito
                const updatedCart = await cartManager.getOneById(cartId);
                socket.emit("cart-updated", { products: updatedCart.products });
        
                console.log(`Producto ${productId} eliminado del carrito ${cartId}`);
            } catch (error) {
                console.error("Error al eliminar producto del carrito:", error.message);
                socket.emit("cart-error", { message: error.message });
            }
        });
        
        //Vaciar el carrito
        socket.on("clear-cart", async (cartId) => {
            try {
                const clearedCart = await cartManager.deleteAllProductFromCart(cartId);
        
                socket.emit("cart-updated", { products: clearedCart.products });
        
                console.log(`Carrito ${cartId} vaciado`);
            } catch (error) {
                console.error("Error al vaciar el carrito:", error.message);
                socket.emit("cart-error", { message: error.message });
            }
        });
        
        //Renderiza la vista del carrito
        socket.on("get-cart", async (cartId) => {
            console.log("Evento 'get-cart' recibido con cartId:", cartId);
            try {
                const cart = await cartManager.getOneById(cartId);
                console.log("Carrito recuperado:", cart);               
                
                socket.emit("cart-updated", { products: cart.products });
            } catch (error) {
                console.error("Error obteniendo carrito:", error.message);
                socket.emit("cart-error", { message: error.message });
            }
        });

        
        
    
    });

};
