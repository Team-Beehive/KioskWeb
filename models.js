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
    constructor(datetime)
    {
        this.datetime = datetime;
    }

    AddData(majorData)
    {
        this.cData.push(majorData);
    }

    PrintDate()
    {
        console.log(this.datetime);
    }
};

module.exports.buidlings =
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
        name: "Dow",
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