const express = require("express");
const PORT = process.env.PORT || 8080;
const path = require("path");

express()
    .use(express.static(path.join(__dirname, "public")))
    .use("/bootstrap", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")))
    .use("/build", express.static(path.join(__dirname, "build/")))
    .set("views", path.join(__dirname, "views"))
    .set("view engine", "ejs")
    .get("/", (req, res) => res.render("pages/index"))
    .get("/building_select", (req, res) => res.render("pages/building_select"))
    .get("/home_page", (req, res) => res.render("pages/home_page"))
    .get("/building", (req, res) => {
        console.log(req.query.page); // To specify page, use ?page=PAGE in the query string
        res.render("pages/building");
    })
    .get("/ejs_test", (req, res) => res.render("pages/ejs_test"))
    .listen(PORT, () => console.log(`Started server on http://localhost:${ PORT }`));
