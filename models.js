//Require for file manipulation on system
var fs = require("fs");

//holds the indiual page data for each major
module.exports.PageData = class PageData {
    constructor(id = "", about = "", campuses = "", type = "") {
        this.id = id;
        this.about = about;
        this.campuses = campuses;
        this.type = type;
    }
};

//holds a list of PageData
module.exports.Category = class Category
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
    datetime;
    categories = [];

    constructor(){
        this.datetime = Date();
        //this.categories = this.GetDataJson();
    }

    GetCategories(){
        if(this.categories != undefined){
            return this.categories;
        }
    }

    AddCategoryData(majorData){
        if(majorData != undefined){
            this.categories.push(majorData);
        }
    }

    PrintDate(){
        console.log(this.datetime);
    }

    SaveDataJson(myObj){
        var jdata = JSON.stringify(myObj);
        
        fs.writeFile("./data.json", jdata, {flag: 'w+'}, function (err) {
            if (err) {
                console.log("There has been an error saving your configuration data.");
                console.log(err.message);
            }
            else { 
                console.log("Configuration saved successfully.");
            }
        }); 
    }

    GetdataJson()
    {
        var data = fs.readFileSync("./pageData.json"), myObj;

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
