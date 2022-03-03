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



var db = firebase.firestore();

//gets a snapshot of Majors page
db.collection("pages").doc("Majors").collection("Degrees").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(doc.id)
    });
});


console.log('Hello World');