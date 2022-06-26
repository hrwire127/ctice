const concatReducer = (oldDocs, action) =>
{
    const { type, docs } = action

    switch (type)
    {
        case "ADD":
            return [...oldDocs].concat(docs)
        case "SET":
            return docs
        default:
            return oldDocs
    }
}

export default concatReducer;