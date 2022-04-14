const { BodyRule, Rules } = require('./validationRules');

function validateBody(title, description, newFile, date) //
{
    const titleRule = new BodyRule(title.length, Rules.title_max_char, 0)
    if (titleRule.getVal()) return titleRule.processMsg()

    const descRule = new BodyRule(description.blocks.length, Rules.desc_max_blocks, 0)
    if (descRule.getVal()) return descRule.processMsg()

    if (newFile)
    {
        const fileRule = new BodyRule(newFile.size, Rules.file_max_size, 0)
        if (fileRule.getVal()) return fileRule.processMsg()

        const fileFormat = new BodyRule(newFile.mimetype, Rules.file_format, 3)
        if (fileFormat.getVal()) return fileFormat.processMsg()

    }

    const dateRule = new BodyRule(date.length, Rules.date_length, 0)
    if (dateRule.getVal()) return dateRule.processMsg()
}


function validateUser(username, password, email)//
{
    const usernameRule = new BodyRule(username.length, Rules.username_max_char, 0)
    if (usernameRule.getVal()) return usernameRule.processMsg()

    const passwordRule = new BodyRule(password.length, Rules.password_max_char, 0)
    if (passwordRule.getVal()) return passwordRule.processMsg()

    if (email)
    {

        const emailRule = new BodyRule(email.length, Rules.email_max_char, 0)
        if (emailRule.getVal()) return emailRule.processMsg()

        const includesRule = new BodyRule(email, Rules.email_includes, 4)
        if (includesRule.getVal()) return includesRule.processMsg()
    }
}

function modifyDesc(description)//
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

function getToken()
{
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++)
    {
        token += characters[Math.floor(Math.random() * characters.length)];
    }
    return token;
}

module.exports = { validateBody, validateUser, modifyDesc, getToken }