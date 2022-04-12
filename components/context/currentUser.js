import React from 'react'

const UserContext = React.createContext({
    user: undefined
});


export default UserContext;
// function userReducer(state, action)
// {
//     switch (action.type)
//     {
//         case 'false': {
//             return { user: false }
//         }
//         case 'true': {
//             return { user: true }
//         }
//         default: {
//             throw new Error(`Unhandled action type: ${action.type}`)
//         }
//     }
// }

// function UserProvider({ children })
// {
//     const [state, dispatch] = React.useReducer(userReducer, { user: false })


//     const value = { state, dispatch }
//     return <UserContext.Provider value={value}>{children}</UserContext.Provider>
// }


// function UseUser()
// {
//     const context = React.useContext(UserContext)
//     if (context === undefined)
//     {
//         throw new Error('useUser must be used within a userProvider')
//     }
//     return context
// }

// function UserConsumer({ children })
// {
//     return (
//         <UserContext.Consumer>
//             {context =>
//             {
//                 if (context === undefined)
//                 {
//                     throw new Error('UserConsumer must be used within a UserProvider')
//                 }
//                 return children(context)
//             }}
//         </UserContext.Consumer>
//     )
// }

// export { UserProvider as userProvider, UseUser as useUser, UserConsumer as userConsumer }