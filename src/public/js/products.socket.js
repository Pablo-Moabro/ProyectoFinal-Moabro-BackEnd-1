const socket = io();

const productsList = document.getElementById("products-list");
const productsForm = document.getElementById("products-form");
const errorMessage = document.getElementById("error-message");
const deleteProductId = document.getElementById("delete-product-id");
const btnDeleteProduct = document.getElementById("btn-delete-product");

socket.on("products-list", (data) => {
    const products = data.products ?? [];

    productsList.innerText = "";

    products.forEach((product) => {
        productsList.innerHTML += `<li>
        Id: ${product._id} - 
        Nombre: ${product.title} - 
        Descripción: ${product.description} - 
        Código: ${product.code} - 
        Precio: ${product.price} -
        Estado: ${product.status} - 
        Stock: ${product.stock} - 
        Categoria: ${product.category}
        </li>`;
    });
});

productsForm.onsubmit = (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    errorMessage.innerText = "";
    form.reset();

    socket.emit("insert-product", {
        title: formData.get("title"),
        description: formData.get("description"),
        code: formData.get("code"),
        price: parseFloat(formData.get("price")),
        status: formData.get("status") || "off",
        stock: parseInt(formData.get("stock"), 10),
        category: formData.get("category"),
    })
};

btnDeleteProduct.onclick = () => {
    const id = Number(deleteProductId.value);
    deleteProductId.value = "";
    errorMessage.innerText = "";

    if (id > 0){
        socket.emit("delete-product", { _id })
    };
};

socket.on("error-message", (data) =>{
    errorMessage.innerText = data.message
});