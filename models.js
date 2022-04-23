//Require for file manipulation on system
var fs = require("fs");

//holds the indiual page data for each major
module.exports.PageData = class PageData {
    keyCategories = [];
    constructor(id, about, campuses, type) {
        this.id = id;
        this.about = about;
        this.campuses = campuses;
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
            console.log("There has been an error parsing data from data.JSON");
            console.log(err);
        }
    }

    SaveCategoriesJson(myObj){
        var jdata = JSON.stringify(myObj);
        
        fs.writeFileSync("./categories.json", jdata, function (err) {
            if (err) {
                console.log("There has been an error saving your configuration data.");
                console.log(err.message);
            }
            else { 
                console.log("Configuration saved successfully.");
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
            console.log("There has been an error parsing data from pages.JSON");
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