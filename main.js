const express = require("express");
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, doc, getDoc, getDocs } = require("firebase/firestore");
const PORT = process.env.PORT || 8080;
const path = require("path");
const models = require("./models");

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

const collectionData = new models.CollectionData();
const pageData = new models.Pages();

getDoc(doc(db, "pages", "Majors")).then((snapshot, options) => {
    if (snapshot != undefined)
    {
        let data = snapshot.data(options);
        collectionData.SetCategories(data["Categories"]);
        collectionData.SaveCategoriesJson();
    }
    else 
    {
        console.log("Failed to read data from online database.");
    }
});


getDocs(collection(db, "pages", "Majors", "Degrees")).then((snapshot) => {
    if (snapshot != undefined) {
        let pages = {};
        snapshot.forEach((doc, options) => {
            let data = doc.data(options);
            
            pages[doc.id] = {
                name: doc.id, 
                about: data["about"], 
                campuses: data["campuses"], 
                type: data["type"]
            };
        });
        pageData.SetPages(pages);
    }
    else 
    {
        console.log("Failed to read data from online database.");
    }
});

express()
    .use(express.static(path.join(__dirname, "public")))
    .use("/bootstrap", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")))
    .use("/build", express.static(path.join(__dirname, "build/")))

    .set("views", path.join(__dirname, "views"))
    .set("view engine", "ejs")

    .get("/", (req, res) => res.render("pages/links"))
    .get("/links", (req, res) => res.render("pages/links"))
    .get("/building_select", (req, res) => {
        res.render("pages/building_select", {buildings: models.buildings});
    })
    .get("/major_select", (req, res) => {

        try{
            res.render("pages/major_select", { categories: collectionData.data["Categories"] });
        }
        catch(err)
        {
            console.log(err);
            res.render("pages/404");
        }
    })
    .get("/home_page", (req, res) => res.render("pages/home_page"))
    .get("/building", (req, res) => {
        // console.log(req.query.page); // To specify page, add ?page=PAGE to the href
        res.render("pages/building", {building: models.buildings[req.query.page]});
    })
    .get("/major", (req, res) => {
        let major = req.query.page;
        console.log(pageData.pages);
        res.render("pages/major", { major: pageData.pages["Pages"][major] });
    })
    .get("/old_building_select", (req, res) => res.render("pages/old_building_select"))
    .get("*", (req, res) => res.render("pages/404")) // 404 Handler
    .disable("x-powered-by") // Prevents end users from knowing that the server is express
    .listen(PORT, () => console.log(`Started server on http://localhost:${ PORT }`));
