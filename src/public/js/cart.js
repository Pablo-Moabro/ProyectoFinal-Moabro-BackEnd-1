const socket = io();
const btnHome = document.getElementById("go-home");

const cartId = window.location.pathname.split("/")[2];
console.log("Emitiendo get-cart con cartId:", cartId);
console.log("Ruta actual:", window.location.pathname);

socket.emit("get-cart", cartId);


const cartList = document.getElementById("cart-list");




socket.on("cart-updated", (data) => {
    console.log(data)
    const { products } = data;
    
    // Renderiza los productos del carrito en la tabla
    cartList.innerHTML = products
        .map(
            (product) =>  `
            <tr>
                <td>${product.product.title}</td>
                <td>${product.product.description}</td>
                <td>${product.product.code}</td>
                <td>${product.product.price}</td>
                <td>${product.product.category}</td>
                <td>${product.quantity}</td>
            </tr>
        `
        )
        .join("");
});

socket.on("cart-error", (data) => {
    console.error("Error al obtener el carrito:", data.message);
    cartList.innerHTML = "<tr><td colspan='6'>Error al cargar el carrito.</td></tr>";
});


btnHome.addEventListener("click", () => {
    window.location.href = "/";
});


