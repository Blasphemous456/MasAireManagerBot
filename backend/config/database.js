const mongoose = require("mongoose");

const conectarDB = async () => {
    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("Base de datos conectada");

    } catch (error) {

        console.log("Error al conectar la base de datos");
        console.log(error);

        process.exit(1);

    }
};

module.exports = conectarDB;