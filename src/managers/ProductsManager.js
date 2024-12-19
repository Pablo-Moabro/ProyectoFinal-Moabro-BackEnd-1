import ErrorManager from "./ErrorManager.js";
import ProductModel from "../models/product.model.js";
import { isValidID } from "../config/mongoose.config.js";
import { convertToBoolean } from "../utils/converter.js";

export default class ProductManager{
    #productModel;

    constructor() {
        this.#productModel = ProductModel;
    }

    async #findOneById(id) {
        if(!isValidID(id)){
            throw new ErrorManager("ID no válido" , 400);
        };

        const product = await this.#productModel.findById(id);

        if(!product){
            throw new ErrorManager("ID no encontrado" , 404);
        };

        return product;
    };

    async getAll(params) {
        try {
            const $and = [];

            if(params?.price) $and.push({ price: { regex: params.price, $options: "i"} });

            if(params?.category) $and.push({ category: params.category});

            const filters = $and.length > 0 ? { $and } : {};

            const sort = {
                asc: {price: 1},
                desc: {price: -1}
            };

            const paginationOptions = {
                limit: params?.limit || 5,
                page: params?.page || 1,
                sort: sort[params?.sort] ?? {},
                lean: true
            };

            const products = await this.#productModel.paginate(filters, paginationOptions);
            return products;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    };

    async getOneById(id) {
        try {
            const product = await this.#findOneById(id);
            return product;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    };

    async insertOne(data) {
        try {
            const product = await this.#productModel.create({
                ...data,
                status: convertToBoolean(data.status)
            });
            return product;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    };

    async updateOneById(id, data) {
        try {
            const product = await this.#findOneById(id);

            const newValues = {
                ...product, 
                ...data,
                status: data.status ? convertToBoolean(data.status) : product.status };
            product.set(newValues);
            product.save();
            return product;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    };

    async deleteOneById (id) {
        try {
            const product = await this.#findOneById(id);
            await product.deleteOne();
            return product;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    };
};
