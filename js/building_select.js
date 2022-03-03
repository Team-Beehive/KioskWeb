// with Commonjs syntax (if using Node)
const firebase = require("firebase/app");
require("firebase/firestore");

// TODO: Add SDKs for Firebase products that you want to use
//
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig =
{
    apiKey: "AIzaSyCwReoKDSMZgqVD1BvOb5aUQi3QJALE7hc",
    authDomain: "oit-kiosk.firebaseapp.com",
    projectId: "oit-kiosk",
    storageBucket: "oit-kiosk.appspot.com",
    messagingSenderId: "622074473491",
    appId: "1:622074473491:web:f3fb2717a8577b8ff963e6",
    measurementId: "G-BYNMKM80XC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Get a reference to the database service
const database = getDatabase(app);

// the hello world program
console.log('Hello World');

async function GetDocs()
{
	const querySnapshot = await getDocs(collections(db, "pages").getDocs("Map").collection("Buildings"));
	querySnapshot.forEach(doc => { console.log(`${doc.id} => ${doc.data()}`) });
}