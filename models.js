//Require for file manipulation on system
var fs = require("fs");

//holds the indiual page data for each major
module.exports.PageData = class PageData {
    keyCategories = [];
    constructor(id, about, campuses, quickFacts, type) {
        this.id = id;
        this.about = about;
        this.campuses = campuses;
        this.quickFacts = quickFacts;
        this.type = type;
    }
};

//Class that holds all the page data in pages array , has a get set for pages. Takes nothing.
module.exports.Pages = class Pages{
    pages = [];

    GetPages(){
        return this.pages;
    }
    
    AddPageData(PageData){
        this.pages.push(PageData);
    }
}

//holds a list of PageData
module.exports.Category = class Category
{
    title;
    pageData = [];
    
    constructor(category_tittle){
        this.title = category_tittle;
    }
    
    GetPageData(){
        return this.pageData;
    }
    
    AddPageData(PageData){
        this.pageData.push(PageData);
    }
}


//Holds a list of catagories
module.exports.CollectionData = class CollectionData
{
    datetime;
    //list of categories string
    categories = [];
    //list of category classes got after everyting is already in a json
    categoryData = [];

    constructor(){
        this.datetime = Date();
    }

    GetCategories(){
        if(this.categories != undefined){
            return this.categories;
        }
    }

    AddCategories(majorData){
        if(majorData != undefined){
            this.categories.push(majorData);
        }
    }

    AddCategoryData(majorData){
        if(majorData != undefined){
            this.categoryData.push(majorData);
        }
    }

    AddPageData(PageData){
        this.pageData.push(PageData);
    }

    PrintDate(){
        console.log(this.datetime);
    }

    GetCategoriesJson()
    {
        var data = fs.readFileSync("./categories.json"), myObj;

        try {
            myObj = JSON.parse(data);
            if(myObj != undefined){
                return myObj;
            }
        }
        catch (err) {
            console.log("There has been an error reading data from categories.JSON");
            console.log(err);
        }
    }

    SaveCategoriesJson(myObj){
        var jdata = JSON.stringify(myObj);
        
        fs.writeFileSync("./categories.json", jdata, function (err) {
            if (err) {
                console.log("There has been an error saving your category data.");
                console.log(err.message);
            }
            else { 
                console.log("categories saved successfully.");
            }
        }); 
    }

    SavePagesJson(myObj){
        var jdata = JSON.stringify(myObj);
    
        fs.writeFileSync("./pages.json", jdata, {flag: 'w+'}, function (err) {
            if (err) {
                console.log("There has been an error saving your pages.");
                console.log(err.message);
            }
            else { 
                console.log("Pages saved successfully.");
            }
        }); 
    }

    GetPagesJson()
    {
        var data = fs.readFileSync("./pages.json"), myObj;

        try {
            myObj = JSON.parse(data);
            if(myObj != undefined){
                return myObj;
            }
        }
        catch (err) {
            console.log("There has been an error reading data from pages.JSON");
            console.log(err);
        }
    }

    GetCredentialsJson()
    {
        var data = fs.readFileSync("./credentials.json"), myObj;

        try {
            myObj = JSON.parse(data);
            if(myObj != undefined){
                return myObj;
            }
        }
        catch (err) {
            console.log("There has been an error reading data from credentials.JSON");
            console.log(err);
        }
    }
};

module.exports.Professor = class Professor{
    constructor(name, department, email, office, phoneNumber){
        this.firstname = name.split(" ")[0];
        this.lastname = name.split(" ")[1];
        this.department = department;
        this.email = email;
        this.office = office;
        this.phoneNumber = phoneNumber;
    }
}

module.exports.Professors = class Professors{

    //list of class professors
    professors = [];

    AddProfessor(professor){
        this.professors.push(professor);
    }

    GetProfessors(){
        return this.professors;
    }

    GetSourtedProfessors(){
        return this.professors.sort();
    }

    SaveProfessorsJson(myObj){
        var jdata = JSON.stringify(myObj);
    
        fs.writeFileSync("./professors.json", jdata, function (err) {
            if (err) {
                console.log("There has been an error saving your professors.");
                console.log(err.message);
            }
            else { 
                console.log("Professors saved successfully.");
            }
        }); 
    }

    GetProfessorsJson()
    {
        var data = fs.readFileSync("./professors.json"), myObj;

        try {
            myObj = JSON.parse(data);
            if(myObj != undefined){
                return myObj;
            }
        }
        catch (err) {
            console.log("There has been an error reading data from professors.JSON");
            console.log(err);
        }
    }
};

module.exports.Building = class Building{
    constructor(name, majors, nameInfo, professors, roomTypes, year){
        this.name = name;
        this.majors = majors;
        this.nameInfo = nameInfo;
        this.professors = professors;
        this.roomTypes = roomTypes;
        this.year = year;
    }
};

module.exports.Buildings = class Buildings{
    buildings = [];

    AddBuilding(building){
        this.buildings.push(building);
    }

    GetBuildings(){
        return this.buildings;
    }

    SaveBuildingsJson(myObj){
        var jdata = JSON.stringify(myObj);
    
        fs.writeFileSync("./buildings.json", jdata, function (err) {
            if (err) {
                console.log("There has been an error saving your buildings.");
                console.log(err.message);
            }
            else { 
                console.log("Buildings saved successfully.");
            }
        }); 
    }

    GetProfessorsJson()
    {
        var data = fs.readFileSync("./buildings.json"), myObj;

        try {
            myObj = JSON.parse(data);
            if(myObj != undefined){
                return myObj;
            }
        }
        catch (err) {
            console.log("There has been an error reading data from buildings.JSON");
            console.log(err);
        }
    }
};

module.exports.buildings =
{
    "Purvine": 
    {
        name: "Purvine",
        images:
            [
                "images/purvine1.jpg",
                "images/purvine2.jpg",
                "images/purvine3.jpg",
                "images/purvine4.jpg"
            ]
    },
    "Dow":
    {
        name: "Martha Anne Dow Center for Health Professions",
        images:
            [
                "images/dow1.jpg"
            ]
    },
    "CEET":
    {
        name: "CEET",
        images:
            [
                "images/ceet1.jpg"
            ]
    },
    "College Union":
    {
        name: "College Union",
        images:
            [
                "images/cu1.jpg",
                "images/cu2.jpg"
            ]
    },
    "Learning Resource Center":
    {
        name: "Learning Resource Center",
        images:
            [
                "images/lrc1.jpg",
                "images/lrc2.jpg"
            ]
    },
    "Snell":
    {
        name: "Snell",
        images:
            [
                "images/snell1.jpg",
                "images/snell2.jpg"
            ]
    },
    "Boivin":
    {
        name: "Boivin",
        images:
            [
                "images/boivin1.jpg"
            ]
    },
};