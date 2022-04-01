class FileRule
{
    constructor(body = false, file = false, declaration = false)
    {
        this.body = body;
        this.file = file;
        this.declaration = declaration;
        console.log(body)
        console.log(file)
        console.log(declaration)
    }
    getRule()
    {
        const { body, file, declaration } = this;
        if (body && file && declaration) return 1;
        if (body && file && !declaration) return 2;
        if (!body && !file && !declaration) return 3;
        if (!body && !file && declaration) return 4;
    }
}

module.exports = {
    FileRule
    //1: req.body && file && declaration; 2:req.body && file && !declaration; 3:!req.body && !file && !declaration; 4: !req.body && !file && declaration
    //1:
    //const file = req.files ? await StorageUpload(req.files.file) : null
    //if (declaration)
    //     {
    //         await cloud.destroy(
    //             declaration.file.location,
    //         );
    //     }
    //2:
    //const file = req.files ? await StorageUpload(req.files.file) : null
    //3:
    //
    //4:
    //if (declaration)
    //     {
    //         await cloud.destroy(
    //             declaration.file.location,
    //         );
    //     }

}