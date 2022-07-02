const declrReducer = (oldDeclrs, action) =>
{
    const { count, type, declarations } = action

    switch (type)
    {
        case "ADD":
            return { declarations: [...oldDeclrs.declarations].concat(declarations), count: oldDeclrs.count }
        case "SET":
            return { declarations, count }
        default:
            return oldDeclrs
    }
}

export default declrReducer;