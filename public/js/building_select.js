import { initializeApp, collection, getDocs, getFirestore, enableIndexedDbPersistence } from "../build/firebase.bundle.js";

const app = initializeApp({
    apiKey: "AIzaSyCwReoKDSMZgqVD1BvOb5aUQi3QJALE7hc",
    authDomain: "oit-kiosk.firebaseapp.com",
    projectId: "oit-kiosk",
    storageBucket: "oit-kiosk.appspot.com",
    messagingSenderId: "622074473491",
    appId: "1:622074473491:web:f3fb2717a8577b8ff963e6",
    measurementId: "G-BYNMKM80XC"
});

//Database obj
const db = getFirestore(app);

//enables the offline persistance of the database
enableIndexedDbPersistence(db)
  .catch((err) => {
      if (err.code == 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
      } else if (err.code == 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
      }
  });

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

//holds the collection of pagedata's
class CollectionData
{
    constructor()
    {
        this.data = [];
    }

    AddData(pageData)
    {
        this.data.push(pageData)
    }
}


//Makes the snapshot that gets all the data from the database through query
getDocs(collection(db, "pages", "Majors", "Degrees")).then((querySnapshot) => 
{
    cData = new CollectionData();

    //Gets the data and saves it into the PageData class
    querySnapshot.forEach((doc) => {
        var temp_data = new PageData(doc.id, doc.get("about"), doc.get("campuses"), doc.get("type"));
        PrintData(temp_data);
        cData.data.AddData(temp_data)
    });

});
