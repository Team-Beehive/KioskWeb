import { initializeApp, collection, getDocs, getFirestore } from "../build/firebase.bundle.js";

const app = initializeApp({
    apiKey: "AIzaSyCwReoKDSMZgqVD1BvOb5aUQi3QJALE7hc",
    authDomain: "oit-kiosk.firebaseapp.com",
    projectId: "oit-kiosk",
    storageBucket: "oit-kiosk.appspot.com",
    messagingSenderId: "622074473491",
    appId: "1:622074473491:web:f3fb2717a8577b8ff963e6",
    measurementId: "G-BYNMKM80XC"
});

//stack code
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj));
};

//stack code
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key));
};

//Function that take a PageData and prints out its data
function PrintData(page_data)
{
    console.log(page_data.id, page_data.about, page_data.campuses, page_data.type);
}

//Class to hold each majors data from the database
class PageData
{
    constructor(id, about, campuses, type)
    {
        this.id = id;
        this.about = about;
        this.campuses = campuses;
        this.type = type;
    }
}

//Database obj
const db = getFirestore(app);

getDocs(collection(db, "pages", "Majors", "Degrees")).then((querySnapshot) => 
{

    //clears local storage before writing to it, dont know how it cleans up
    localStorage.clear();

    //Gets the data and saves it into the PageData class
    querySnapshot.forEach((doc) => {
        // var temp_data = new PageData(doc.id, doc.get("about"), doc.get("campuses"), doc.get("type"));
        // localStorage.setObj(doc.id, temp_data);
    });

    // //test to see if it gets everything
    // querySnapshot.forEach((doc) => {
    //     PrintData(localStorage.getObj(doc.id));
    // });

});
