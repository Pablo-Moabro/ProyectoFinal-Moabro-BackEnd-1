import { connect, Types } from "mongoose";

export const connectDB = async () => {
    const URL = "mongodb+srv://pablo:1234@cluster0.c2ytj.mongodb.net/proyectoFinal-CH";

    try {
        await connect(URL);
        console.log("Conectado a MongoDB");
    } catch (error) {
        console.log("error al conectar a MongoDB", error.message);
    }

};

export const isValidID = (id) => {
    return Types.ObjectId.isValid(id);
};