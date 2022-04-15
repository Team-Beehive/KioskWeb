const express = require("express");
const { initializeApp } = require("firebase/app");
const { getFirestore, /*collection,*/ doc, getDoc/*, getDocs*/ } = require("firebase/firestore");
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

express()
    .use(express.static(path.join(__dirname, "public")))
    .use("/bootstrap", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")))
    .use("/build", express.static(path.join(__dirname, "build/")))

    .set("views", path.join(__dirname, "views"))
    .set("view engine", "ejs")

    .get("/", (req, res) => res.render("pages/links"))
    // .get("/building_select", (req, res) => res.render("pages/building_select"))
    .get("/major_select", (req, res) => 
    {
        var collectionData = new models.CollectionData();
        collectionData = collectionData.GetDataJson();
        res.render("pages/major_select", {categories:  collectionData.cCatagories });
    })
    .get("/home_page", (req, res) => res.render("pages/home_page"))
    .get("/building", (req, res) => {
        // console.log(req.query.page); // To specify page, add ?page=PAGE to the href
        res.render("pages/building");
    })
    .get("/major", (req, res) => {
        let temp_major = req.query.page;
        if (major != undefined)
        {
            collection = new models.CollectionData();
            collection.Categories.forEach(category => {
                if(category.title == temp_major){
                    res.render("pages/major", { major: category });
                }
            })
            
        }
        else
            res.render("pages/404");
    })
    .get("/old_building_select", (req, res) => res.render("pages/old_building_select"))
    .get("*", (req, res) => res.render("pages/404")) // 404 Handler
    .disable("x-powered-by") // Prevents end users from knowing that the server is express
    .listen(PORT, () =>
    {
        let collectionData = new models.CollectionData();

        getDoc(doc(db, "pages", "Majors")).then((snapshot, options) =>
        {
            let data = snapshot.data(options);
            
            data["Categories"].forEach(category => {
                //console.log(category["categoryTitle"]);
                temp_categories = new models.Categories(category["categoryTitle"].replace(/[ &/]/g, ""))

                category["relatedDegrees"].forEach(degreeRef => { 
                        degree = degreeRef.path.split("/")[1];
                        //console.log(degree);
                        //console.log(degreeRef);

                        if (degree != undefined){
                            getDoc(doc(db, "pages", "Majors", "Degrees", degree)).then((snapshot, options) => {
                                let data = snapshot.data(options);
                                if (data != undefined) {
                                    let temp_data = new models.MajorPageData(snapshot.id, data["about"], data["campuses"], data["type"]);
                                    temp_categories.AddPageData(temp_data);
                                    collectionData.AddCategoryData(temp_categories);
                                    collectionData.SaveDataJson(collectionData);
                                }
                            });
                        }
                });
            });
        });


        console.log(`Started server on http://localhost:${ PORT }`);
    });

