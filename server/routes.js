const { createRouter, createStorage } = require("sm-express-server");
const controllers = require("./controllers.js");
const path = require("path");

const routes = createRouter("/", (router) => {
	router.get("/patern/:file", controllers.getPaternController);
	router.post("/patern:/file", createStorage(path.join(__dirname, "./mcd")).single("patern"), controllers.setPaternController);
});

module.exports = routes;