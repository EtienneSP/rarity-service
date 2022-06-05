import mongoose = require("mongoose");
import connexionString = require("./configs/app-config");

mongoose.connect(connexionString);

const initDB = () => {
  mongoose.connection
    .once("open", function () {
      console.log("Database connected Successfully");
    })
    .on("error", function (err: object) {
      console.log("Error connecting to MongoDB", err);
    });
};

export = initDB;
