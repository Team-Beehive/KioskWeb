
//https://firebase.google.com/docs/reference/js/v8

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
firebase.initializeApp({

    apiKey: "AIzaSyCwReoKDSMZgqVD1BvOb5aUQi3QJALE7hc",
    authDomain: "oit-kiosk.firebaseapp.com",
    projectId: "oit-kiosk",
    storageBucket: "oit-kiosk.appspot.com",
    messagingSenderId: "622074473491",
    appId: "1:622074473491:web:f3fb2717a8577b8ff963e6",
    measurementId: "G-BYNMKM80XC"
});

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

let major_data = new Array();
var db = firebase.firestore();

//gets doccument snapshot for every doc in collection
db.collection("pages").doc("Majors").collection("Degrees").get().then((querySnapshot) => {

    //Gets the data and saves it into the PageData class
    querySnapshot.forEach((doc) => {
        temp_data = new PageData(doc.id, doc.get("about"), doc.get("campuses"), doc.get("type"));
        major_data.push(temp_data);
    });

    major_data.forEach(element => PrintData(element));
    
});

function PrintData(page_data)
{
    console.log(page_data.id, page_data.about, page_data.campuses, page_data.type)
}


console.log('Hello World');