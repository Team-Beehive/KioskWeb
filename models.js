//Require for file manipulation on system
var fs = require("fs");

//holds the indiual page data for each major
module.exports.MajorPageData = class MajorPageData {
    constructor(id = "", about = "", campuses = "", type = "") {
        this.id = id;
        this.about = about;
        this.campuses = campuses;
        this.type = type;
    }
};

//holds a list of majors and orgonizes them by category
module.exports.Categories = class Categories
{
    title;
    pageData = [];

    constructor(catagory_title){
        this.title = catagory_title;
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
    cCategories = [];
    datetime;

    constructor(){
        this.datetime = Date();
        //this.cCategories = this.GetDataJson();
    }

    GetCcategories(){
        if(this.cCategories != undefined){
            return this.cCategories;
        }
    }

    AddCategoryData(majorData){
        if(majorData != undefined){
            this.cCategories.push(majorData);
        }
    }

    PrintDate(){
        console.log(this.datetime);
    }

    SaveDataJson(myObj){
        var jdata = JSON.stringify(myObj);
        
        fs.writeFile("./config.json", jdata, {flag: 'w+'}, function (err) {
            if (err) {
                console.log("There has been an error saving your configuration data.");
                console.log(err.message);
            }
            else { 
                console.log("Configuration saved successfully.");
            }
        }); 
    }

    GetDataJson()
    {
        var data = fs.readFileSync("./config.json"), myObj;

        try {
            myObj = JSON.parse(data);
            if(myObj != undefined)
            {
                return myObj;
            }
        }
        catch (err) {
            console.log("There has been an error parsing your JSON.");
            console.log(err);
        }
    }

};
