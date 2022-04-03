const CropData = (data, length) =>
{
    length++;
    data.blocks = data.blocks.length > length ? data.blocks.slice(0, length) : data.blocks
    return data
}

const uploadFile = (e, changeState) =>
{
    // changeFile(e.target.files[0]) //change element event target
    const file = e.target.files[0];
    file.arrayBuffer().then(data => changeState(
        {
            lastModified: file.lastModified,
            name: file.name,
            size: file.size,
            type: file.type,
            webkitRelativePath: file.webkitRelativePath,
            data: data,
        }
    ));
}

const deleteFile = (changeState) =>
{
    changeState()
}

function getCurrentDate(separator=''){

    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();

    return `${date<10?`0${date}`:`${date}`}${separator}${month<10?`0${month}`:`${month}`}${separator}${year}`
    }

module.exports = {
    CropData, uploadFile, deleteFile, getCurrentDate
}