class ClientRule
{
    constructor(title, description, file = undefined, date)
    {
        this.title = title;
        this.description = description;
        this.file = file;
        this.date = date;
        this.rules = {
            title_max_char: 20,
            desc_max_blocks: 30,
            file_max_size: 1000000,
            file_format: 'application/pdf',
            date_length: 10
        }
    }

    validateContent()
    {
        const { title, description, file, date, rules } = this;
        const titleRule = title.length > rules.title_max_char
        const descRule = description.blocks.length > rules.desc_max_blocks
        const fileRule = file ? (file.size > rules.file_max_size || file.mimetype !== rules.file_format) : false
        const dateRule = date.length !== rules.date_length
        if (titleRule ||
            descRule ||
            fileRule ||
            dateRule)
        {
            return true
        }
    }
}

module.exports = ClientRule;