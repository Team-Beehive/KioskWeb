const express = require("express");
const { initializeApp } = require("firebase/app");
const { getFirestore, /*collection,*/ doc, getDoc/*, getDocs*/ } = require("firebase/firestore");
const PORT = process.env.PORT || 8080;
const path = require("path");
const models = require("./models");

const { execSync, exec } = require("child_process");


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

let termux_api = false;
let adb = false;

try {
    execSync("adb connect localhost:5555");

    adb = true;
}
catch 
{
    console.error("Package android-tools is not installed correctly. Locking will not work.");
}

try {
    execSync("dpkg -l | grep termux-api", { stdio: ["ignore", "ignore", "ignore"] });
    termux_api = true;
}
catch
{
    console.error("Application Termux:API is not installed. Some non-key features will not work.");
}

process.stdin.resume();//so the program will not close instantly

function exitHandler(options, exitCode) {
    if (options.cleanup) 
    {
        if (adb)
        {
            exec("adb disconnect");
        }
    }
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on("exit", exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on("SIGINT", exitHandler.bind(null, { exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));


console.log();

express()
    .use(express.static(path.join(__dirname, "public")))
    .use("/bootstrap", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")))
    .use("/build", express.static(path.join(__dirname, "build/")))

    .set("views", path.join(__dirname, "views"))
    .set("view engine", "ejs")

    .get("/", (req, res) => res.render("pages/links"))
    .get("/links", (req, res) => res.render("pages/links"))
    // .get("/building_select", (req, res) => res.render("pages/building_select"))
    .get("/major_select", (req, res) => {
        getDoc(doc(db, "pages", "Majors")).then((snapshot, options) => {
            let data = snapshot.data(options);
            if (data != undefined) {
                res.render("pages/major_select", { categories: data["Categories"], bad_chars: /[ &/]/g });
            }
            else
                res.render("pages/404");
        });
    })
    .get("/home_page", (req, res) => res.render("pages/home_page"))
    .get("/building", (req, res) => {
        // console.log(req.query.page); // To specify page, add ?page=PAGE to the href
        res.render("pages/building");
    })
    .get("/major", (req, res) => {
        let major = req.query.page;
        if (major != undefined)
            getDoc(doc(db, "pages", "Majors", "Degrees", major)).then((snapshot, options) => {
                let data = snapshot.data(options);
                if (data != undefined) {
                    let temp_data = new models.MajorPageData(snapshot.id, data["about"], data["campuses"], data["type"]);
                    res.render("pages/major", { major: temp_data });
                }
                else {
                    res.render("pages/404");
                }
            });
        else
            res.render("pages/404");
    })
    .get("/hide_nav", (req, res) => {
        if (adb) {
            execSync("adb shell wm overscan 0,-100,0,-100");

            if (termux_api)
                exec("termux-toast -g bottom 'Successfully locked application!'");
            else
                console.log("Successfully locked application!");

            res.redirect("/links");
        }
        else
            res.redirect("/links");
    })
    .get("/show_nav", (req, res) => {
        if (adb) {
            execSync("adb shell wm overscan 0,0,0,0");

            if (termux_api)
                exec("termux-toast -g bottom 'Successfully unlocked application!'");
            else
                console.log("Successfully unlocked application!");

            res.redirect("/links");
        }
        else
            res.redirect("/links");
    })
    .get("/old_building_select", (req, res) => res.render("pages/old_building_select"))
    .get("*", (req, res) => res.render("pages/404")) // 404 Handler
    .disable("x-powered-by") // Prevents end users from knowing that the server is express
    .listen(PORT, () => console.log(`Started server on http://localhost:${PORT}`));