import express from "express";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import cors from "cors";

const server = express();

const port = process.env.PORT || 3001;

//MIDDLEWARES
server.use(express.json());
server.use(cors());

//ROUTES

//ERRORHANDLERS

mongoose.connect(process.env.MONGO_CONNECTION_LINK);

mongoose.connection.on("connected", () => {
  console.log("Server Successfully Connected to MongoDB");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server running on port ${port}`);
  });
});

server.on("ERROR", (error) => {
  console.log("CONTROLED ERROR", error);
});
