const tagReducer = (tags, action) =>
{
    switch (action.type)
    {
        case "ADD":
            return [...tags, action.tag]
        case "REMOVE":
            return tags.filter((t) => t._id !== action.id)
        default:
            return tags
    }
}

export default tagReducer;