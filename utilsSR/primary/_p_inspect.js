const { valRule } = require('../helpers/val-Rule');
const Rules = require('../rules/validRules')

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

function inspectChange(username = undefined, Files = undefined, location = undefined, bio = undefined, connections = undefined)
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

    if (location)
    {
        const locationRule = new valRule(location.name.length, Rules.location_max_chars, 0)
        if (locationRule.getVal()) return locationRule.processMsg()
    }

    if (bio)
    {
        const bioRule = new valRule(bio.blocks.length, Rules.bio_max_blocks, 0)
        if (bioRule.getVal()) return bioRule.processMsg()
    }

    const { facebook, linkedin, twitter } = connections

    if (facebook)
    {
        const facebookFormat = new valRule(facebook, Rules.facebook_connection_includes, 4)
        if (facebookFormat.getVal()) return facebookFormat.processMsg()
    }

    if (linkedin)
    {
        const twitterFormat = new valRule(twitter, Rules.twitter_connection_includes, 4)
        if (twitterFormat.getVal()) return twitterFormat.processMsg()
    }

    if (twitter)
    {
        const linkedinFormat = new valRule(linkedin, Rules.linkedin_connection_includes, 4)
        if (linkedinFormat.getVal()) return linkedinFormat.processMsg()
    }
}


function inspectPdf(file)
{
    const maxWidth = new valRule(file.width, Rules.pdf_max_width, 0)
    if (maxWidth.getVal()) return maxWidth.processMsg()

    const minWidth = new valRule(file.width, Rules.pdf_min_width, 1)
    if (minWidth.getVal()) return minWidth.processMsg()

    const maxHeight = new valRule(file.height, Rules.pdf_max_height, 0)
    if (maxHeight.getVal()) return maxHeight.processMsg()

    const minHeight = new valRule(file.height, Rules.pdf_min_height, 1)
    if (minHeight.getVal()) return minHeight.processMsg()
}

function inspectProfile(file)
{
    const maxWidth = new valRule(file.width, Rules.profile_max_width, 0)
    if (maxWidth.getVal()) return maxWidth.processMsg()

    const minWidth = new valRule(file.width, Rules.profile_min_width, 1)
    if (minWidth.getVal()) return minWidth.processMsg()

    const maxHeight = new valRule(file.height, Rules.profile_max_height, 0)
    if (maxHeight.getVal()) return maxHeight.processMsg()

    const minHeight = new valRule(file.height, Rules.profile_min_height, 1)
    if (minHeight.getVal()) return minHeight.processMsg()
}

module.exports = { inspectDecrl, inspectComment, inspectUser, inspectChange, inspectPdf, inspectProfile }