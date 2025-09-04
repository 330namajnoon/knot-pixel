const { createController } = require("sm-express-server");
const path = require("path");
const { exes } = require("child_process");

const controllers = {
    getPaternController: createController(async (req, res) => {
        res.set("Content-Type", "image/png");
        res.set("Access-Control-Allow-Origin", "*");
        res.sendFile(path.join(__dirname, `./mcd/${req.params.file}`));
    }),
    setPaternController: createController((req, res) => {
        const file = req.params.file;
        console.log(req.file);
        exes(
            `mv ${path.join(__dirname, `./mcd/${req.file.originalname}`)} ${path.join(__dirname, `./mcd/${file}`)}`,
            (error, stdout, stderr) => {
                if (error || stderr) {
                    res.status(500).send({ error: "Error renaming file" });
                    return;
                }

                res.send({ success: true, message: "File uploaded and renamed successfully" });
            }
        );
    }),
};

module.exports = controllers;
