const declrReducer = (oldDeclrs, action) =>
{
    const {count, type, declarations} = action

    switch (type)
    {
        case "ADD":
            return [...oldDeclrs].concat(declarations)
        case "SET":
            return {declarations, count}
        default:
            return oldDeclrs
    }
}

export default declrReducer;