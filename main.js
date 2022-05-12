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
const { readdirSync, mkdir } = require("fs");

const good_chars = /[^A-Za-z0-9_-]/g;

function cleanString(string)
{
    return string.replace(good_chars, "");
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

    // VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
    .get("/", (req, res) => res.render("pages/links"))
    // ^^^^^^ REMEMBER TO CHANGE FOR PRODUCTION ^^^^^^

    .get("/home_page", (req, res) => res.render("pages/home_page"))
    .get("/links", (req, res) => res.render("pages/links"))

    .get("/building_select", (req, res) => {
        res.render("pages/building_select", { buildings: models.buildings });
    })
    .get("/major_select", (req, res) => {

        //Start: get amajor pages
        collectionData = new models.CollectionData();
        //gets the array of categories
        classCollection = collectionData.GetCategoriesJson();
        //gets all the data for each page
        classPages = collectionData.GetPagesJson();

        let images = {};

        classCollection.categories.forEach(category => {
            tempCategory = new models.Category(category);
            images[cleanString(category)] = readdirSync("public/images/Categories/" + cleanString(category));

            //for each page in pages
            classPages.pages.forEach(page => {
                count = 2;
                //for each category in page
                page.keyCategories.forEach(pageCategory => {
                    //if the category is in the pages categories
                    if (pageCategory == category) {
                        if (count % 2 == 0) {
                            tempCategory.AddPageData(page);
                            images[cleanString(page.id)] = readdirSync("public/images/Majors/" + cleanString(page.id));
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

        res.render("pages/major_select", { categories: collectionData.categoryData, images: images, cleanString: cleanString });
    })
    .get("/professor_select", (req, res) => {
        res.render("pages/professor_select", {professors: professors.professors});
    })
    .get("/building", (req, res) => {
        let building = req.query.page;
        res.render("pages/building", {
            building: models.buildings[building],
            secret: building == "Purvine"
        }); // If building is not Purvine, secret is false
    })
    .get("/major", (req, res) => {
        let major = req.query.page;
        let rendered = false;
        collectionData = new models.CollectionData();
        classPages = collectionData.GetPagesJson();
        classPages.pages.forEach(page => {
            if (page.id == major && !rendered) {
                var images = readdirSync("public/images/Majors/" + cleanString(page.id));
                res.render("pages/major", { major: page, images: images, cleanString: cleanString });
                rendered = true;
            }
        });
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
                    images: images
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
    .get("/old_building_select", (req, res) => res.render("pages/old_building_select"))
    .get("*", (req, res) => res.render("pages/404")) // 404 Handler
    .disable("x-powered-by") // Prevents end users from knowing that the server is express
    .listen(PORT, () => {
        let collectionData = new models.CollectionData();

        //gets all pages
        getDocs(collection(db, "pages", "Majors", "Degrees")).then((querySnapshot) => {
            let classPages = new models.Pages();

            querySnapshot.forEach(doc => {
                mkdir("public/images/Majors/" + cleanString(doc.id), () => { });
                //sets all pages with no category key
                tempPage = new models.PageData(doc.id, doc.get("about"), doc.get("campuses"), doc.get("type"), doc.get("quick_facts"));
                classPages.AddPageData(tempPage);
            });
            //saves pages without key category to json
            collectionData.SavePagesJson(classPages);
        });



        //gets all categories
        getDoc(doc(db, "pages", "Majors")).then((snapshot, options) => {
            if (snapshot != undefined) {

                let data = snapshot.data(options);
                let classPages = new models.Pages();
                pageData = collectionData.GetPagesJson();

                data["Categories"].forEach(category => {
                    collectionData.AddCategories(category["categoryTitle"]);
                    mkdir("public/images/Categories/" + cleanString(category["categoryTitle"]), () => { });
                    //classCategory = new models.Category(category["categoryTitle"]);

                    //list of degrees under a category
                    category["relatedDegrees"].forEach(relatedDegree => {

                        pageData.pages.forEach(page => {
                            //console.log(page);
                            if (page.id == relatedDegree.id && page.keyCategories.length == 0) {
                                page.keyCategories.push(category["categoryTitle"]);
                                classPages.AddPageData(page);
                                //console.log("  ===>", page.id, "-->", category["categoryTitle"]);
                            }
                            if (page.id == relatedDegree.id && page.keyCategories.length != 0) {
                                page.keyCategories.push(category["categoryTitle"]);
                            }

                        });
                        //console.log("------------------")
                    });

                    collectionData.SavePagesJson(classPages);
                });
                //saves all data to json here
                collectionData.SaveCategoriesJson(collectionData);
            }
        });

        getDocs(collection(db, "pages", "Professors", "Professors")).then((querySnapshot) => {
            professors = new models.Professors();

            querySnapshot.forEach(professor => {
                mkdir("public/images/Professors/" + cleanString(professor.id), () => {});
                professors.AddProfessor(new models.Professor(professor.id, professor.get("department"), professor.get("email"), professor.get("office"), professor.get("phone_number")));
            });

            professors.SaveProfessorsJson(professors);
        });


        console.log(`Started server on http://localhost:${PORT}\n\nReady!`);
    });

