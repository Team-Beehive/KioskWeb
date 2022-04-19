const { Deferred } = require("@firebase/util");
const express = require("express");
const { initializeApp } = require("firebase/app");
const { getFirestore, /*collection,*/ doc, getDoc,/*, getDocs*/ 
collection} = require("firebase/firestore");
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
        /*
        getDocs(collection(db, "pages", "Majors", "Degrees")).then((querySnapshot) => {
            //Gets the data and saves it into the PageData class
            querySnapshot.forEach((doc) => {
                // var temp_data = new PageData(doc.id, doc.get("about"), doc.get("campuses"), doc.get("type"));
                let page_data = 
                            {
                                id: doc.id,
                                about: doc.get("about"),
                                campuses: doc.get("campuses"),
                                type: doc.get("type"),
                                category: ""
                            }
            });
        });
        */

        getDoc(doc(db, "pages", "Majors")).then((snapshot, options) =>
        {
            let collectionData = new models.CollectionData();
            let pages = new models.Pages();
            let data = snapshot.data(options);
            count = 0;
            
            data["Categories"].forEach(category => {
                //console.log(category["categoryTitle"]);
                collectionData.AddCategories(category["categoryTitle"]);

                category["relatedDegrees"].forEach(degreeRef => { 
                    //console.log(degreeRef.id);

                    getDoc(doc(db, "pages", "Majors", "Degrees", degreeRef.id)).then((snapshot, options) => {
                        let data = snapshot.data(options);

                        if (data != undefined) {

                            //will read twice without if
                            if(count % 2 == 0){
                                temp_page = new models.PageData(snapshot.id, data["about"], data["campuses"], data["type"], category["categoryTitle"]);
                                pages.AddPageData(temp_page);
                                //console.log("-----",page_data.key_category, "--",page_data.id);
                                collectionData.SavePagesJson(pages);
                            } 
                            count++;
                        }
                    });
                    
                
                });
            
            });
            
            collectionData.SaveDataJson(collectionData);
        });

        //how to get all data
        collectionData = new models.CollectionData();
        class_categories = collectionData.GetDataJson();
        class_pages = collectionData.GetPagesJson();

        categories = class_categories.categories;
        console.log(categories, class_pages[0]);
        /*

        class_categories.categories.forEach(category =>{
            temp_category = new models.Category(category);

            class_pages.pages.forEach(page =>{
                if(page.key_category = category){
                    temp_category.AddPageData(page);
                }
            })
            collectionData.AddCategories(temp_category);
        })
        console.log(collectionData);
        */
        console.log(`Started server on http://localhost:${ PORT }`);
    });

