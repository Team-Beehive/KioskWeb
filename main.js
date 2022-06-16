const express = require("express");

const PORT = process.env.PORT || 8080;
const path = require("path");
const models = require("./models");
const { readdirSync, mkdir } = require("fs");
const { exec } = require("child_process");
const { exit } = require("process");

const good_chars = /[^A-Za-z0-9_-]/g;

function cleanString(string)
{
    return string.replace(good_chars, "");
}

var browser;

var professors = new models.Professors();
var buildings = new models.Buildings(); 
var classPages = new models.Pages();
var collectionData = new models.CollectionData();
var pageData = new models.Pages();

function Update()
{
    return new Promise((resolve) => {
    // Pinging is disallowed in Purvine. This seems to be more reliable.
        require("dns").lookupService("8.8.8.8", 53, function (err) {
            if (err) {
            //no connection no firestore
                console.log("No connection, pulling from offline database.");

                professors = models.Professors.GetProfessorsJson();
                buildings = models.Buildings.GetBuildingsJson();
                pageData = models.CollectionData.GetPagesJson();

                // let categories = models.CollectionData.GetCategoriesJson();
                // categories["categories"].forEach(category => {
                //     collectionData.AddCategories(category);
                // });

                resolve(false);
            } 
            else {
                console.log("Connected, updating offline database");
                //if connected to internet add needed requires, pull data and save to json
                const { initializeApp } = require("firebase/app");
                const { getFirestore, collection, doc, getDoc, getDocs } = require("firebase/firestore");

                let collectionData = new models.CollectionData();
                let jsonCredentials = collectionData.GetCredentialsJson();
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
                mkdir("public/images/Slides", () => { });
                //save all pages
                getDocs(collection(db, "pages", "Majors", "Degrees")).then((querySnapshot) => {
                    classPages = new models.Pages();

                    querySnapshot.forEach(doc => {
                        mkdir("public/images/Majors/" + cleanString(doc.id), () => { });
                        let tempPage = new models.PageData(doc.id, doc.get("about"), doc.get("campuses"), doc.get("type"), doc.get("quick_facts"));
                        classPages.AddPageData(tempPage);
                    });

                    collectionData.SavePagesJson(classPages);
                });

                //save all categories and gets key categories
                getDoc(doc(db, "pages", "Majors")).then((snapshot, options) => {
                    if (snapshot != undefined) {

                        let data = snapshot.data(options);
                        pageData = models.CollectionData.GetPagesJson();

                        data["Categories"].forEach(category => {
                            collectionData.AddCategories(category["categoryTitle"]);
                            mkdir("public/images/Categories/" + cleanString(category["categoryTitle"]), () => { });

                            if (category["relatedDegrees"] != null) {
                                category["relatedDegrees"].forEach(relatedDegree => {
                                    Object.keys(pageData.pages).forEach((page) => {
                                        if (pageData.pages[page].id == relatedDegree.id) {
                                            pageData.pages[page].keyCategories.push(category["categoryTitle"]);
                                            // classPages.AddPageData(page);
                                        }
                                    });
                                });
                            }

                        
                        });
                        collectionData.SavePagesJson(pageData);
                        collectionData.SaveCategoriesJson(collectionData);
                    }
                });

                //save all professors
                getDocs(collection(db, "pages", "Professors", "Professors")).then((querySnapshot) => {
                    professors = new models.Professors();

                    querySnapshot.forEach(professor => {
                        mkdir("public/images/Professors/" + cleanString(professor.id), () => { });
                        professors.AddProfessor(new models.Professor(professor.id, professor.get("department"), professor.get("email"), professor.get("office"), professor.get("phone_number")));
                    });

                    professors.SaveProfessorsJson(professors);
                });

                //save all buildings
                getDocs(collection(db, "pages", "Map", "Buildings")).then((querySnapshot) => {
                    buildings = new models.Buildings();

                    querySnapshot.forEach(building => {
                        mkdir("public/images/Buildings/" + cleanString(building.id), () => { });
                        buildings.AddBuilding(new models.Building(building.id, building.get("majors"), building.get("name_info"), building.get("professors"), building.get("room_types"), building.get("year")));
                    });

                    buildings.SaveBuildingsJson(buildings);
                });

                resolve(true);
            }
        });
    });
}

Update().then(() => console.log("Done."));

express()
    .use(express.static(path.join(__dirname, "public")))
    .use("/bootstrap", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")))
    .use("/build", express.static(path.join(__dirname, "build/")))

    .set("views", path.join(__dirname, "views"))
    .set("view engine", "ejs")

    .get("/start", (req, res) => 
    {
        var images = readdirSync("public/images/Slides");
        res.render("pages/start", {images});

    })

    // VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
    .get("/", (req, res) => res.render("pages/home_page"))
    // ^^^^^^ REMEMBER TO CHANGE FOR PRODUCTION ^^^^^^

    .get("/home_page", (req, res) => res.render("pages/home_page"))
    .get("/links", (req, res) => res.render("pages/links"))

    .get("/building_select", (req, res) => {
        var images = {};
        Object.keys(buildings.buildings).forEach((name) =>
        {
            images[name] = readdirSync("public/images/Buildings/" + cleanString(name));
        });
        res.render("pages/building_select", { buildings: buildings.buildings, images, cleanString });
    })
    .get("/major_select", (req, res) => {

        //Start: get amajor pages
        collectionData = new models.CollectionData();
        //gets the array of categories
        let classCollection = models.CollectionData.GetCategoriesJson();
        //gets all the data for each page
        classPages = models.CollectionData.GetPagesJson();

        let images = {};

        classCollection.categories.forEach(category => {
            let tempCategory = new models.Category(category);
            images[cleanString(category)] = readdirSync("public/images/Categories/" + cleanString(category));

            //for each page in pages
            // console.log(pageData);
            Object.keys(pageData.pages).forEach((page) => {
                let count = 2;
                //for each category in page
                pageData.pages[page].keyCategories.forEach(pageCategory => {
                    //if the category is in the pages categories
                    if (pageCategory == category) {
                        if (count % 2 == 0) {
                            tempCategory.AddPageData(pageData.pages[page]);
                            images[cleanString(pageData.pages[page].id)] = readdirSync("public/images/Majors/" + cleanString(pageData.pages[page].id));
                            count++;
                        }
                        else {
                            count++;
                        }
                    }
                });
            });

            collectionData.AddCategoryData(tempCategory);
        }); //End: get major pages

        res.render("pages/major_select", { categories: collectionData.categoryData, images, cleanString });
    })
    .get("/professor_select", (req, res) => {
        res.render("pages/professor_select", {professors: professors.professors, sort: req.query.sort});
    })
    .get("/building", (req, res) => {
        let building = req.query.page;
        if (building != undefined)
        {
            let data = buildings.buildings[building];
            if (data != undefined) {
                let images = readdirSync("public/images/Buildings/" + cleanString(building));
                res.render("pages/building", {
                    building: buildings.buildings[building],
                    secret: building == "Purvine Hall",
                    images,
                    cleanString
                }); // If building is not Purvine, secret is false
            }
            else {
                res.render("pages/404");
            }
        }
        else
            res.render("pages/404");
        
        
    })
    .get("/major", (req, res) => {
        let major = req.query.page;
        let rendered = false;
        // collectionData = new models.CollectionData();
        // classPages = collectionData.GetPagesJson();
        if (major != undefined)
        {
            let page = classPages.pages[major];
            if (page != undefined) {
                var images = readdirSync("public/images/Majors/" + cleanString(page.id));
                res.render("pages/major", { major: page, images, cleanString });
                rendered = true;
            }
        }
        if (!rendered)
            res.render("pages/404");
    })
    .get("/professor", (req, res) => {
        var professor = req.query.page;
        if (professor != undefined) {
            let data = professors.professors[professor];
            if (data != undefined) {
                let images = readdirSync("public/images/Professors/" + cleanString(professor));
                res.render("pages/professor", {
                    professor: data,
                    images,
                    cleanString
                });
            }
            else {
                res.render("pages/404");
            }
        }
        else {
            res.render("pages/404");
        }
    })
    .get("/request_update", (req, res) => { 
        res.render("pages/links", {message: "Attempting to get kiosk data...", redirect: "update"});
    })
    .get("/update", (req, res) => {
        Update().then((callback) => {
            res.render("pages/links", { message: callback ? "Updated Kiosk Data!" : "Unable to update kiosk data. Please confirm that you are connected to the internet." });
        });
    })
    .get("/kill", () => {
        // End the firefox process
        if (browser != undefined)
        {
            browser.kill();
        }
        exit(0);
    })
    .get("*", (req, res) => res.render("pages/404")) // 404 Handler
    .disable("x-powered-by") // Prevents end users from knowing that the server is express
    .listen(PORT, () =>
    {
        console.log(`Started server on http://localhost:${ PORT }`);
        browser = exec("env MOZ_USE_XINPUT2=1 firefox http://localhost:8080/start -kiosk");
    });

