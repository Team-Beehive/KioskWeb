var fs = require("fs");

module.exports.MajorPageData = class MajorPageData {
    constructor(id, about, campuses, type) {
        this.id = id;
        this.about = about;
        this.campuses = campuses;
        this.type = type;
    }
};

module.exports.CollectionData = class CollectionData
{
    
    cData = [];
    datetime;
    cCategories = [];
    

    constructor()
    {
        //this.test = new module.exports.MajorPageData("test page data", "hello this is some sample about", "Klamath", "Online");
        this.datetime = Date();
    }

    AddData(majorData)
    {
        this.cData.push(majorData);
    }

    PrintDate()
    {
        console.log(this.datetime);
    }

    SaveDataJson(data)
    {
        var jdata = JSON.stringify(data);
        fs.writeFile("./config.json", jdata, function (err) {
            if (err) {
                console.log("There has been an error saving your configuration data.");
                console.log(err.message);
                return false;
            }
            else
            { 
                console.log("Configuration saved successfully.");
                return true;
            }
        }); 
    }

    GetDataJson()
    {
        var data = fs.readFileSync("./config.json"), myObj;

        try 
        {
            myObj = JSON.parse(data);
            if(myObj != undefined)
            {
                return myObj;
            }
        }
        catch (err) 
        {
            console.log("There has been an error parsing your JSON.");
            console.log(err);
        }
    }

};
