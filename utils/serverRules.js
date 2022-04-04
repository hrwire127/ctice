class FileRule
{
    constructor(body = undefined, files = undefined, declaration = undefined)
    {
        this.body = body;
        this.files = files;
        this.declaration = declaration;
    }
    getRule()
    {
        //create file , - file
        //edit file => file (changed)  \/, (new | modfified) -file => file \/, -file => -file \/, file => -file \/,  file => file (not changed)
        //delete file, -file
        const { body, files, declaration } = this;
        const hadFile = declaration ? declaration['file']['url'] !== undefined : undefined;
        if (body.file && files && hadFile) return 1;
        if (body.file && files && !hadFile) return 2;
        if (!body.file && !files && !hadFile) return 3;
        if (!body.file && !files && hadFile) return 4;
        if (body.file && !files && hadFile) return 5;
        return 3;
    }
    async processObj(upload, destroy, rule = undefined)
    {
        rule = rule ? rule : this.getRule()
        const { body, files, declaration } = this;
        let Obj = {
            ...body
        }
        switch (rule)
        {
            case 1:
                let file1 = files ? await upload(files.file) : undefined
                await destroy.destroy(
                    declaration.file.location,
                )
                Obj.file = {
                    name: files.file.name,
                    url: file1.url,
                    location: file1.location
                }
                break;
            case 2:
                let file2 = files ? await upload(files.file) : undefined
                Obj.file = {
                    name: files.file.name,
                    url: file2.url,
                    location: file2.location
                }
                break;
            case 3:
                break;
            case 4:
                await destroy.destroy(
                    declaration.file.location,
                )
                declaration.file = undefined
                await declaration.save();
                break;
            case 5:
                Obj.file = declaration.file;
                break;
            case 6:
                if (declaration.file.location)
                {
                    await destroy.destroy(
                        declaration.file.location,
                    )
                }
                break;
        }
        return Obj;
    }
}

module.exports = {
    FileRule
}