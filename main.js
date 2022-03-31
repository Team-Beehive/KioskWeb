const express = require("express");
const { initializeApp } = require("firebase/app");
const { getFirestore, /*collection,*/ doc, getDoc, /*getDocs*/ } = require("firebase/firestore");
const PORT = process.env.PORT || 8080;
const path = require("path");

class PageData {
    constructor(id, about, campuses, type) {
        this.id = id;
        this.about = about;
        this.campuses = campuses;
        this.type = type;
    }
}

const app = initializeApp({
    apiKey: "AIzaSyCwReoKDSMZgqVD1BvOb5aUQi3QJALE7hc",
    authDomain: "oit-kiosk.firebaseapp.com",
    projectId: "oit-kiosk",
    storageBucket: "oit-kiosk.appspot.com",
    messagingSenderId: "622074473491",
    appId: "1:622074473491:web:f3fb2717a8577b8ff963e6",
    measurementId: "G-BYNMKM80XC"
});

const db = getFirestore(app);

express()
    .use(express.static(path.join(__dirname, "public")))
    .use("/bootstrap", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")))
    .use("/build", express.static(path.join(__dirname, "build/")))

    .set("views", path.join(__dirname, "views"))
    .set("view engine", "ejs")

    .get("/", (req, res) => res.render("pages/links"))
    .get("/building_select", (req, res) => res.render("pages/building_select"))
    .get("/major_select", (req, res) => res.render("pages/major_select"))
    .get("/home_page", (req, res) => res.render("pages/home_page"))
    .get("/building", (req, res) => {
        // console.log(req.query.page); // To specify page, use ?page=PAGE in the query string
        res.render("pages/building");
    })
    .get("/major", (req, res) => {
        const major = req.query.page;
        if (major != undefined)
            getDoc(doc(db, "pages", "Majors", "Degrees", major)).then((snapshot, options) => {
                const data = snapshot.data(options);
                if (data != undefined)
                {
                    var temp_data = new PageData(snapshot.id, data["about"], data["campuses"], data["type"]);
                    res.render("pages/major", { major: temp_data });
                }
                else
                {
                    res.render("pages/404");
                }
            });
        else
            res.render("pages/404");
    })
    .get("/old_building_select", (req, res) => res.render("pages/old_building_select"))
    .get("*", (req, res) => res.render("pages/404")) // 404 Handler
    .listen(PORT, () => console.log(`Started server on http://localhost:${ PORT }`));
