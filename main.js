/* eslint-disable no-undef */
const express = require("express");

const PORT = process.env.PORT || 8080;
const path = require("path");
const models = require("./models");

//checks for internet connection by pinging google.com
require('dns').resolve('www.google.com', function(err) {
    if (err) {
        //no connection no firestore
       console.log("No connection, pulling from offline database.");
    } else {
       console.log("Connected, updating offline database");
        //if connected to internet add needed requires, pull data and save to json
        const { initializeApp } = require("firebase/app");
        const { getFirestore, collection, doc, getDoc, getDocs } = require("firebase/firestore");

        let collectionData = new models.CollectionData();
        jsonCredentials = collectionData.GetCredentialsJson();
        const app = initializeApp({
            apiKey: jsonCredentials.apiKey,
            authDomain: jsonCredentials.authDomain,
            projectId: jsonCredentials.projectId,
            storageBucket: jsonCredentials.storageBucket,
            messagingSenderId: jsonCredentials.messagingSenderId,
            appId: jsonCredentials.appId,
            measurementId: jsonCredentials.measurementId
        });
        const db = getFirestore(app);

        //save all pages
        getDocs(collection(db, "pages", "Majors", "Degrees")).then((querySnapshot) => {
            let classPages = new models.Pages();
            
            querySnapshot.forEach(doc => {
                //sets all pages with no category key
                tempPage = new models.PageData(doc.id, doc.get("about"), doc.get("campuses"), doc.get("quick_facts"), doc.get("type"));
                classPages.AddPageData(tempPage);
            })
            //saves pages without key category to json
            collectionData.SavePagesJson(classPages);
        });

        //save all categories and gets key categories
        getDoc(doc(db, "pages", "Majors")).then((snapshot, options) =>{
            if(snapshot != undefined){

                let data = snapshot.data(options);
                let classPages = new models.Pages();
                pageData = collectionData.GetPagesJson();

                data["Categories"].forEach(category => {
                    collectionData.AddCategories(category["categoryTitle"]);
                    //classCategory = new models.Category(category["categoryTitle"]);

                    if(category["relatedDegrees"] != null){
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
                    }

                    collectionData.SavePagesJson(classPages);
                });

                collectionData.SaveCategoriesJson(collectionData);
            }
        });
       
        //save all professors
        getDocs(collection(db, "pages", "Professors", "Professors")).then((querySnapshot) => {
            professors = new models.Professors();

            querySnapshot.forEach(professor => {
                professors.AddProfessor(new models.Professor(professor.id, professor.get("department"), professor.get("email"), professor.get("office"), professor.get("phone_number")));
            })

            
            //console.log(professors.professors);
            professors.SaveProfessorsJson(professors);
        });

        getDocs(collection(db, "pages", "Map", "Buildings")).then((querySnapshot) => {
            buildings = new models.Buildings();

            querySnapshot.forEach(building => {
                buildings.AddBuilding(new models.Building(building.id, building.get("majors"), building.get("nameInfo"), building.get("professors"), building.get("roomTypes"), building.get("year")));
                console.log(building.id);
            })

            buildings.SaveBuildingsJson(buildings);
            console.log(buildings);
        });
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
            
            //for each page in pages
            classPages.pages.forEach(page =>{
                count = 2;
                //for each category in page
                page.keyCategories.forEach(pageCategory => {
                    //if the category is in the pages categories
                    if(pageCategory == category){
                        if(count % 2 == 0)
                        {
                            tempCategory.AddPageData(page);
                            count++;
                        }
                        else{
                            count++;
                        }
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
        collectionData = new models.CollectionData();
        classPages = collectionData.GetPagesJson();
        classPages.pages.forEach(page =>{
            if(page.id == major){
                res.render("pages/major", { major: page });
            }
        })
        res.render("pages/404");
    })
    .get("/old_building_select", (req, res) => res.render("pages/old_building_select"))
    .get("*", (req, res) => res.render("pages/404")) // 404 Handler
    .disable("x-powered-by") // Prevents end users from knowing that the server is express
    .listen(PORT, () =>
    {
        console.log(`Started server on http://localhost:${ PORT }`);
    });

