/* eslint-disable no-undef */
const express = require("express");
const { initializeApp } = require("firebase/app");

// old main includes
//const { getFirestore, /*collection,*/ doc, getDoc,/*, getDocs*/ collection} = require("firebase/firestore");
//const { builtinModules } = require("module");

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


express()
    .use(express.static(path.join(__dirname, "public")))
    .use("/bootstrap", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")))
    .use("/build", express.static(path.join(__dirname, "build/")))

    .set("views", path.join(__dirname, "views"))
    .set("view engine", "ejs")

    .get("/", (req, res) => res.render("pages/links"))
    .get("/links", (req, res) => res.render("pages/links"))
    .get("/professor", (req, res) => {
        var professor = req.query.page;
        if (professor != undefined)
            getDoc(doc(db, "pages", "Professors", "Professors", professor)).then((snapshot, options) => {
                let data = snapshot.data(options);
                if (data != undefined)
                {
                    res.render("pages/professor", {professor: 
                        {
                            name: professor, // This is the professor that was defined at the req.query.page
                            department: data["department"],
                            email: data["email"],
                            office: data["office"],
                            phone_number: data["phone_number"]
                        }
                    });
                }
                else
                {
                    res.render("pages/404");
                }
            });
        else
            res.render("pages/404");
    })
    .get("/building_select", (req, res) => {
        res.render("pages/building_select", {buildings: models.buildings});
    })
    .get("/major_select", (req, res) => {

        //Start: get amajor pages
        collectionData = new models.CollectionData();
        //gets the array of categories
        classCollection = collectionData.GetCategoriesJson();
        //gets all the data for each page
        classPages = collectionData.GetPagesJson();

        classCollection.categories.forEach(category =>{
            tempCategory = new models.Category(category);
            
            classPages.pages.forEach(page =>{
                page.keyCategories.forEach(category => {
                    if(page.keyCategory == category){
                        tempCategory.AddPageData(page);
                    }
                }) 
            });
            
            collectionData.AddCategoryData(tempCategory);
        }); //End: get major pages

        res.render("pages/major_select", { categories: collectionData.categoryData });
    })
    .get("/home_page", (req, res) => res.render("pages/home_page"))
    .get("/building", (req, res) => {
        // console.log(req.query.page); // To specify page, add ?page=PAGE to the href
        res.render("pages/building", {building: models.buildings[req.query.page]});
    })
    .get("/major", (req, res) => {
        let major = req.query.page;
        if (major != undefined)
        {
            getDoc(doc(db, "pages", "Majors", "Degrees", major)).then((snapshot, options) => {
                let data = snapshot.data(options);
                if (data != undefined) {
                    let tempData = new models.PageData(snapshot.id, data["about"], data["campuses"], data["type"]);
                    res.render("pages/major", { major: tempData });
                }
                else {
                    res.render("pages/404");
                }
            });
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

        //gets all pages
        getDocs(collection(db, "pages", "Majors", "Degrees")).then((querySnapshot) => {
            let classPages = new models.Pages();
            
            querySnapshot.forEach(doc => {
                //sets all pages with no category key
                tempPage = new models.PageData(doc.id, doc.get("about"), doc.get("campuses"), doc.get("type"));
                classPages.AddPageData(tempPage);
            })
            //saves pages without key category to json
            collectionData.SavePagesJson(classPages);
        });

        //gets all categories
        getDoc(doc(db, "pages", "Majors")).then((snapshot, options) =>{
            if(snapshot != undefined){

                let data = snapshot.data(options);
                let classPages = new models.Pages();
                pageData = collectionData.GetPagesJson();

                data["Categories"].forEach(category => {
                    collectionData.AddCategories(category["categoryTitle"]);
                    //classCategory = new models.Category(category["categoryTitle"]);

                    //list of degrees under a category
                    category["relatedDegrees"].forEach(relatedDegree => { 
                        
                        pageData.pages.forEach(page =>{
                            //console.log(page);
                            if(page.id == relatedDegree.id && page.keyCategories.length == 0){
                                page.keyCategories.push(category["categoryTitle"]);
                                classPages.AddPageData(page);
                                //console.log("  ===>", page.id, "-->", category["categoryTitle"]);
                            }
                            if(page.id == relatedDegree.id && page.keyCategories.length != 0){
                                page.keyCategories.push(category["categoryTitle"]);
                            }
                            
                        })
                        //console.log("------------------")
                    });

                    collectionData.SavePagesJson(classPages);
                });
                //saves all data to json here
                collectionData.SaveCategoriesJson(collectionData);
            }
        });
       
        
        console.log(`Started server on http://localhost:${ PORT }`);
    });

