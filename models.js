module.exports.MajorPageData = class MajorPageData {
    constructor(id, about, campuses, type) {
        this.id = id;
        this.about = about;
        this.campuses = campuses;
        this.type = type;
    }
}

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
}