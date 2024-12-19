import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new Schema({
    title:{
        index: { name: "idx_title"},
        type: String,
        required: [true, "El título es requerido"],
    },
    description:{
        type: String,
    },
    code:{
        type: String,
        required: [true, "El código es requerido"],
        trim: true,
        uppercase: true,
        unique: true,
        validate:{
            validator: async function (code) {
                const countDocuments = await this.model("products").countDocuments({
                    _id: { $ne: this._id },
                    code,
                });

                return countDocuments === 0;
            },
            message: "Código de producto duplicado"
        },
    },
    price:{
        type: Number,
        required: [true, "El precio es requerido"],
    },
    status:{
        type: Boolean,
    },
    stock:{
        type: Number,
        required: [true, "El stock es requerido"],
    },
    category:{
        type: String,
        required: [true, "La categoria es requerida"],
    },
    thumbnail:{
        type: String
    },
},{
    timestamps: true,
    versionKey: false,
});

productSchema.plugin(paginate);

const ProductModel = model("products", productSchema);

export default ProductModel;