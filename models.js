//Require for file manipulation on system
const fs = require("fs");

//holds the indiual page data for each major
module.exports.PageData = class PageData {
    constructor(id, about, campuses, type, key) {
        this.id = id;
        this.about = about;
        this.campuses = campuses;
        this.type = type;
        this.keyCategory = key;
    }
};

//Class that holds all the page data in pages array , has a get set for pages. Takes nothing.
module.exports.Pages = class Pages{
    pages = {};

    GetPages(){
        return this.pages;
    }
    
    AddPageData(PageData){
        this.pages.push(PageData);
    }

    AddPages(pages)
    {
        this.pages["Pages"] = pages;
    }

    SetPages(pages) {
        this.pageData = pages;
    }

    SavePagesJson() {
        var jdata = JSON.stringify(this.pages);

        fs.writeFileSync("./pages.json", jdata, { flag: "w+" }, function (err) {
            if (err) {
                console.log("There has been an error saving your pages.");
                console.log(err.message);
            }
            else {
                console.log("Pages saved successfully.");
            }
        });
    }

    GetPagesJson() {
        var data = fs.readFileSync("./pages.json"), myObj;

        try {
            myObj = JSON.parse(data);
            if (myObj != undefined) {
                this.pages = myObj;
                return myObj;
            }
        }
        catch (err) {
            console.log("There has been an error parsing data from pages.JSON");
            console.log(err);
        }
    }
};

//holds a list of PageData
module.exports.Category = class Category
{
    title;
    pageData = [];
    
    constructor(categoryTitle){
        this.title = categoryTitle;
    }
    
    GetPageData(){
        return this.pageData;
    }
    
    AddPageData(PageData){
        this.pageData.push(PageData);
    }
};


//Holds a list of catagories
module.exports.CollectionData = class CollectionData
{
    datetime;
    data = {};

    constructor(){
        this.datetime = Date();
    }

    GetCategories(){
        if(this.data != undefined){
            return this.data;
        }
    }

    SetCategories(categories)
    {
        this.data["Categories"] = categories;
    }

    AddCategories(majorData){
        if(majorData != undefined){
            this.data.push(majorData);
        }
    }

    AddCategoryData(majorData){
        if(majorData != undefined){
            this.categoryData.push(majorData);
        }
    }
    

    PrintDate(){
        console.log(this.datetime);
    }
    
    GetCategoriesJson()
    {
        var data = fs.readFileSync("categories.json"), myObj;

        try {
            myObj = JSON.parse(data);
            if(myObj != undefined){
                this.data = myObj;
                return myObj;
            }
        }
        catch (err) {
            console.log("There has been an error parsing data from data.JSON");
            console.log(err);
        }
    }

    SaveCategoriesJson()
    {
        this.data["Date"] = Date();
        var jdata = JSON.stringify(this.data);
        
        fs.writeFileSync("categories.json", jdata, (err) => {
            if (err) {
                console.log("There has been an error saving your configuration data.");
                console.log(err.message);
            }
            else { 
                console.log("Configuration saved successfully.");
            }
        }); 
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
    }
};