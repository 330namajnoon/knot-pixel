const { Server, createController, createRouter } = require("sm-express-server");
const path = require("path");
const bodyParser = require("body-parser");
const routes = require("./routes.js");
const express = require("express");
const cors = require("cors");

const server = new Server(
    4005,
    path.join(__dirname, "./"),
    [
        bodyParser.json({ limit: "50mb" }),
        // bodyParser.urlencoded({ extended: true, limit: "100mb" }),
        express.static(path.join(__dirname, "./mcd/")),
    ],
    [routes],
    []
);

server.start(() => {
    console.log("server is up on port 4005!");
});
