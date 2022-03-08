
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

function saveData(id, about, campuses, type)
{

}



var db = firebase.firestore();
//gets doccument snapshot for every doc in collection
db.collection("pages").doc("Majors").collection("Degrees").get().then((querySnapshot) => {
    let major_data = new Map();
    querySnapshot.forEach((doc) => {

        //Prints of id of each doc in collection
        major_data.set("id", doc.id);
        //Prints the about section of the doc
        major_data.set("about", doc.get("about"));
        //Prints the campuses section of the doc
        major_data.set("campuses", doc.get("campuses"));
        //Prints the type section of the doc
        major_data.set("type", doc.get("type"));
        console.log(major_data.get("id"), major_data.get("about"), major_data.get("campuses"), major_data.get("type"));

    });
});

console.log('Hello World');
