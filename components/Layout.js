import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import Footer from './Footer'
import Header from './Header'
import { UserContext } from './context/currentUser'

export default function Layout(props)
{

    const [user, changeUser] = useState(false)

    const childrenWithProps = React.Children.map(props.children, child =>
    {
        if (React.isValidElement(child))
        {
            return React.cloneElement(child, { changeUser, user });
        }
        return child;
    });

    return (
        <>
            <UserContext.Provider value={user}>
                        <main style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <UserContext.Consumer>
                            {
                                value => <Header sections={[]} title="Ctice" user={value} changeUser={changeUser} />
                            }
                        </UserContext.Consumer>
                        <Box sx={{ mt: 3, mb: 3, flex: 1 }} >{childrenWithProps}</Box>
                        {/* <Footer /> */}
                    </main>
            </UserContext.Provider>
        </>
    )
}