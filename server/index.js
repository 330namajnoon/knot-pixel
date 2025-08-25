const { Server, createController, createRouter } = require("sm-express-server");
const path = require("path");
const bodyParser = require("body-parser");

const setPaternController = createController((req, res) => {
	console.log(req.body)
})

const route = createRouter("/", (router) => {
	router.post("/patern", setPaternController);
});

const server = new Server(4005, path.join(__dirname, "./"), [bodyParser.json(), bodyParser.urlencoded({ extended: false })], [route], []);

server.start(() => {
	console.log("server is up on port 4005!");
})