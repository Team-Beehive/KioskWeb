const { Console } = require("console");
const express = require("express");
const { getFirestore, doc, getDoc, getDocs, collection} = require("firebase/firestore");
const { initializeApp } = require("firebase/app");
const PORT = process.env.PORT || 8080;
const path = require("path");   
const { getSystemErrorMap } = require("util");
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

<<<<<<< .mine
    .get("/", (req, res) => 
    {
        res.render("pages/links");
    })

    // .get("/building_select", (req, res) => res.render("pages/building_select"))
    .get("/major_select", (req, res) => 
    {
        var collectionData = new models.CollectionData();
        collectionData = collectionData.GetDataJson();
        res.render("pages/major_select", {categories:  collectionData.cCatagories });
    })

    // res.render("pages/major_select"))






=======
    .get("/", (req, res) => res.render("pages/links"))
    .get("/building_select", (req, res) => res.render("pages/building_select"))
    .get("/major_select", (req, res) => 
    {

        getDocs(collection(db, "pages", "Majors", "Degrees")).then((querySnapshot) => 
        {
            collection_data = new models.CollectionData();

            //Gets the data and saves it into the PageData class
            querySnapshot.forEach((doc) => 
            {
                var temp_major = new models.MajorPageData(doc.id, doc.get("about"), doc.get("campuses"), doc.get("type"));
                collection_data.cData.AddData(temp_major)
            });

            res.render("pages/major_select", {data: collection_data});
        });
    })
    
>>>>>>> .theirs
    .get("/home_page", (req, res) => res.render("pages/home_page"))
    .get("/building", (req, res) => {
        // console.log(req.query.page); // To specify page, add ?page=PAGE to the href
        res.render("pages/building");   
    })

    .get("/major", (req, res) => {
        const major = req.query.page;
        if (major != undefined)
            getDoc(doc(db, "pages", "Majors", "Degrees", major)).then((snapshot, options) => {
                const data = snapshot.data(options);
<<<<<<< .mine

=======
                //major_data = new models.CollectionData();
>>>>>>> .theirs
                if (data != undefined)
                {
<<<<<<< .mine
                        var temp_data = new models.MajorPageData(snapshot.id, data["about"], data["campuses"], data["type"]);
                        res.render("pages/major", { major: temp_data });

=======
                    
                    var majorPage = new models.MajorPageData(snapshot.id, data["about"], data["campuses"], data["type"]);
                    res.render("pages/major", { major: majorPage });
>>>>>>> .theirs
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
    .disable("x-powered-by")
    .listen(PORT, () => 
    {
        collectionData = new models.CollectionData();

        /*
        const querySnapshot = await getDocs(collection(db, "Majors"));
        querySnapshot.forEach((doc) => {
            collectionData.AddData(doc);
        });
        */
        getDoc(doc(db, "pages", "Majors")).then((snapshot, options) =>
        {
            let data = snapshot.data(options);
            collectionData.cCatagories = data["Categories"];

            collectionData.SaveDataJson(collectionData);
        });


        console.log(`Started server on http://localhost:${ PORT }`);
    });
