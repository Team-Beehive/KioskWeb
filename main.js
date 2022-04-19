const express = require("express");
const { initializeApp } = require("firebase/app");
const { getFirestore, /*collection,*/ doc, getDoc/*, getDocs*/ } = require("firebase/firestore");
const PORT = process.env.PORT || 8080;
const path = require("path");
const models = require("./models");

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
        //Start: get all data
        collectionData = new models.CollectionData();
        //gets the array of categories from json
        classCollection = collectionData.GetDataJson();
        //gets all the data for each page from json
        classPages = collectionData.GetPagesJson();
        
        classCollection.categories.forEach(category =>{
            tempCategory = new models.Category(category);
     
            classPages.pages.forEach(page =>{
                if(page.keyCategory == category){
                    tempCategory.AddPageData(page);
                }
            })
     
            collectionData.AddCategoryData(tempCategory);
        })//End: get all data   

        try{
            res.render("pages/major_select", { categories: collectionData.categoryData});
        }
        catch(err){
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
        
            collectionData = new models.CollectionData();
            classPages = collectionData.GetPagesJson();
            classPages.pages.forEach(page =>{
                if(page.id = major){
                    tempData = page;
                }
            })
            res.render("pages/major", { major: tempData });
            res.render("pages/404");
    })
    .get("/old_building_select", (req, res) => res.render("pages/old_building_select"))
    .get("*", (req, res) => res.render("pages/404")) // 404 Handler
    .disable("x-powered-by") // Prevents end users from knowing that the server is express
    .listen(PORT, () =>{
        //tries to query all data and saves it into two jsons
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

            getDoc(doc(db, "pages", "Majors")).then((snapshot, options) =>
            {
                if(snapshot != null){
                    let collectionData = new models.CollectionData();
                    let pages = new models.Pages();
                    let data = snapshot.data(options);
                    count = 0;
                    
                    data["Categories"].forEach(category => {
                        collectionData.AddCategories(category["categoryTitle"]);
    
                        category["relatedDegrees"].forEach(degreeRef => { 
    
                            getDoc(doc(db, "pages", "Majors", "Degrees", degreeRef.id)).then((snapshot, options) => {
                                let data = snapshot.data(options);
    
                                if (data != undefined) {
                                    //will read twice without if
                                    if(count % 2 == 0){
                                        tempPage = new models.PageData(snapshot.id, data["about"], data["campuses"], data["type"], category["categoryTitle"]);
                                        pages.AddPageData(tempPage);
                                        //ooverites each time so the last overitw will write all data, saves all the data for the pages in the pages class in an array
                                        collectionData.SavePagesJson(pages);
                                    } 
                                    count++;
                                }
                            });
                        });
                    
                    });
                    collectionData.SaveDataJson(collectionData);
                }
                else{
                    console.log("Failed to read data from online database.");
                }
                //saves all the category data here
            });

        console.log(`Started server on http://localhost:${ PORT }`
    )})       
