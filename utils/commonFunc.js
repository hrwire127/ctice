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


module.exports = {
    CropData, uploadFile, deleteFile
}