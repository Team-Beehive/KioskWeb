module.exports.MajorPageData = class MajorPageData 
{
    constructor(id, about, campuses, type) 
    {
        this.id = id;
        this.about = about;
        this.campuses = campuses;
        this.type = type;
    }
}

module.exports.CollectionData = class CollectionData
{
    cData = [];

    constructor(id)
    {
        this.id = id;
    }

    AddData(majorData)
    {
        this.cData.push(majorData)
    }
}