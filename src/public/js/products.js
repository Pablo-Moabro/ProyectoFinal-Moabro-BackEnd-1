const socket = io();

const productsList = document.getElementById("products-list");
const btnRefreshProductsList = document.getElementById("btn-refresh-products-list");
const btnOrderAsc = document.getElementById("sort-asc");
const btnOrderDesc = document.getElementById("sort-desc");
const btnOrderNone = document.getElementById("sort-none");
const btnPrevPage = document.getElementById("prev-page");
const btnNextPage = document.getElementById("next-page");
const currentPageDisplay = document.getElementById("current-page");
const totalPagesDisplay = document.getElementById("total-pages");
const btnGoToCart = document.getElementById("go-to-cart");
const btnClearCart = document.getElementById("clear-cart");
const btnAddToCart = document.getElementById("btn-add-cart");
const btnDeleteCart = document.getElementById("btn-delete-cart");

let currentPage = 1;
let totalPages = 1;



const loadProductsList = async (sort = "") => {
    const response = await fetch (`/api/products?page=${currentPage}&sort=${sort}` , {method: "GET"});
    const data = await response.json();
    const { docs: products, totalPages: total } = data.payload;
        totalPages = total;
        currentPageDisplay.textContent = currentPage;
        totalPagesDisplay.textContent = totalPages;
    

        productsList.innerHTML = products
        .map(
            (product) => `
        <tr>
            <td>${product._id}</td>
            <td>${product.title}</td>
            <td>${product.price}</td>
            <td>
                <button class="btn-add-cart" id="add-to-cart" data-id="${product._id}">Agregar al carrito</button>
                <button class="btn-delete-cart" id="delete-cart" data-id="${product._id}">Eliminar del carrito</button>
            </td>
        </tr>
    `
        )
        .join("");

        assignAddToCartEvents();

};


//Agregar al Carrito
function assignAddToCartEvents() {
    const addToCartButtons = document.querySelectorAll(".btn-add-cart");
    addToCartButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const productId = button.getAttribute("data-id");
            const cartId = "675c82b2d139067074d4e144";

            
            socket.emit("add-to-cart", { cartId, productId });

            console.log(`Producto ${productId} enviado al carrito ${cartId}`);
        });
    });
};

socket.on("cart-updated", ({ products }) => {
    console.log("Carrito actualizado con los siguientes productos:", products);
});

socket.on("cart-error", ({ message }) => {
    console.error("Error al agregar al carrito:", message);
});

//Eliminar del Carrito
productsList.addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-delete-cart")) {
        const productId = event.target.getAttribute("data-id");
        const cartId = "675c82b2d139067074d4e144";  // Cambiar por el ID del carrito que estás utilizando

        // Emitir evento para eliminar producto del carrito
        socket.emit("delete-product-from-cart", { cartId, productId });

        console.log(`Producto ${productId} enviado para eliminar del carrito ${cartId}`);
    }
});

//Vaciar el carrito
btnClearCart.addEventListener("click", () => {
    const cartId = "675c82b2d139067074d4e144";

    socket.emit("clear-cart", cartId);

    console.log(`Carrito ${cartId} enviado para vaciar`);
});

//Ir la carrito
btnGoToCart.addEventListener("click", () => {
    const cartId = "675c82b2d139067074d4e144";
    window.location.href = `/cart/${cartId}`;
});

btnOrderAsc.addEventListener("click", () => {
    loadProductsList("asc");
});
btnOrderDesc.addEventListener("click", () => {
    loadProductsList("desc");
});
btnOrderNone.addEventListener("click", () => {
    loadProductsList();
});


btnPrevPage.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        loadProductsList();
    }
});
btnNextPage.addEventListener("click", () => {
    if (currentPage < totalPages) {
        currentPage++;
        loadProductsList();
    }
});



btnRefreshProductsList.addEventListener("click", () =>{
    loadProductsList();
    console.log("Lista recargada");
});

loadProductsList();