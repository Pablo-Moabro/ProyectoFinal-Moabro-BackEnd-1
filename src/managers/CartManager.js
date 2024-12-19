import ErrorManager from "./ErrorManager.js";
import CartModel from "../models/cart.model.js";
import { isValidID } from "../config/mongoose.config.js";

export default class CartManager{
    #cartModel;
    
    constructor() {
        this.#cartModel = CartModel;
    };

    async #findOneById(id) {
        if(!isValidID(id)){
            throw new ErrorManager("ID no válido" , 400);
        };

        const cart = await this.#cartModel.findById(id).populate("products.product");
        
        if(!cart){
            throw new ErrorManager("ID no encontrado" , 404);
        };

        return cart;
    };

    async getAll(params) {
        try {
            
            const paginationOptions = {
                limit: params?.limit || 10,
                page: params?.page || 1,
                populate:"products.product",
                lean: true
            };

            const carts = await this.#cartModel.paginate({},  paginationOptions);
            return carts;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    };

    async getOneById(id) {
        try {
            const cart = await this.#findOneById(id);
            return cart;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    };

    async insertOne(data) {
        try {
            const cart = await this.#cartModel.create(data);
            return cart;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    };

    addOneProduct = async (id, productId, quantity = 1) => {
        try {
            const cart = await this.#findOneById(id);
            const productIndex = cart.products.findIndex((item) => item.product._id.toString() === productId);

            if (!quantity || isNaN(quantity) || quantity <= 0){
                throw new ErrorManager("La cantidad minima debe ser 1" , 400);
            }

            if (productIndex >= 0) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            await cart.save();

            return cart;

        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    };

    deleteProductFromCart = async (id, productId) => {
        try {
            const cart = await this.#findOneById(id);
            
            const productIndex = cart.products.findIndex((item) => item.product._id.toString() === productId);

            if (productIndex === -1) {
                throw new ErrorManager(`ID no encontrado`, 404);
            }

            cart.products.splice(productIndex, 1);

            await cart.save();
            
            return cart;

        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    };

    deleteAllProductFromCart = async (id) => {
        try {
            const cart = await this.#findOneById(id);

            cart.products = [];

            await cart.save();

            return cart;

        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    };

    deleteCart = async (id) => {
        try {
            const cart = await this.#findOneById(id);

            await cart.deleteOne();

            return { message: "Carrito eliminado"};

        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    };

};