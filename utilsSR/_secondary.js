const { valRule, Rules } = require('./val-Rule');

function inspectDecrl(title, description, Files) //
{
    const titleRule = new valRule(title.length, Rules.title_max_char, 0)
    if (titleRule.getVal()) return titleRule.processMsg()

    const descRule = new valRule(description.blocks.length, Rules.desc_max_blocks, 0)
    if (descRule.getVal()) return descRule.processMsg()

    if (Files)
    {
        const fileRule = new valRule(Files.file.size, Rules.pdf_max_size, 0)
        if (fileRule.getVal()) return fileRule.processMsg()

        const fileFormat = new valRule(Files.file.mimetype, Rules.pdf_format, 3)
        if (fileFormat.getVal()) return fileFormat.processMsg()
    }
}

function inspectComment(content) 
{
    const contentRule = new valRule(content.blocks.length, Rules.comment_max_blocks, 0)
    if (contentRule.getVal()) return contentRule.processMsg()

}

function inspectUser(username = undefined, email = undefined, password = undefined, Files = undefined)
{
    if (username)
    {
        const usernameRule = new valRule(username.length, Rules.username_max_char, 0)
        if (usernameRule.getVal()) return usernameRule.processMsg()
    }

    if (password)
    {
        const passwordRule = new valRule(password.length, Rules.password_max_char, 0)
        if (passwordRule.getVal()) return passwordRule.processMsg()
    }

    if (email)
    {

        const emailRule = new valRule(email.length, Rules.email_max_char, 0)
        if (emailRule.getVal()) return emailRule.processMsg()

        const includesRule = new valRule(email, Rules.email_includes, 4)
        if (includesRule.getVal()) return includesRule.processMsg()
    }

    if (Files)
    {
        const fileRule = new valRule(Files.profile.size, Rules.profile_max_size, 0)
        if (fileRule.getVal()) return fileRule.processMsg()

        const fileFormat = new valRule(Files.profile.mimetype, Rules.profile_formats, 5)
        if (fileFormat.getVal()) return fileFormat.processMsg()
    }
}

function inspectChange(username = undefined, Files = undefined)
{
    if (username)
    {
        const usernameRule = new valRule(username.length, Rules.username_max_char, 0)
        if (usernameRule.getVal()) return usernameRule.processMsg()
    }

    if (Files)
    {
        const fileRule = new valRule(Files.profile.size, Rules.profile_max_size, 0)
        if (fileRule.getVal()) return fileRule.processMsg()

        const fileFormat = new valRule(Files.profile.mimetype, Rules.profile_formats, 5)
        if (fileFormat.getVal()) return fileFormat.processMsg()
    }
}
function modifyDesc(description)
{
    let newDesc = description;
    for (var i = newDesc.blocks.length - 1; i > 0; i--)
    {
        if (newDesc.blocks[i].text === "")
        {
            newDesc.blocks = newDesc.blocks.slice(0, i);
        }
        else 
        {
            break;
        }
    }
    let last = newDesc.blocks.length - 1;
    for (var i = newDesc.blocks[last].text.length - 1; i > 0; i--)
    {
        if (newDesc.blocks[last].text[i] === " ")
        {
            newDesc.blocks[last].text = newDesc.blocks[last].text.slice(0, i);
        }
        else 
        {
            break;
        }
    }
    return newDesc
}

function genToken()
{
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++)
    {
        token += characters[Math.floor(Math.random() * characters.length)];
    }
    return token;
}


module.exports = { inspectDecrl, inspectComment, inspectUser, modifyDesc, genToken, inspectChange }