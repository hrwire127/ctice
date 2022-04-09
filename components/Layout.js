import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import Footer from './Footer'
import Loading from './Loading'
import Header from './Header'
import { UserContext } from './context/currentUser'

export default function Layout(props)
{
    const [PageLoaded, setPageLoaded] = useState(false)
    useEffect(() => { setPageLoaded(true) }, []);

    const [user, changeUser] = useState(false)

    const childrenWithProps = React.Children.map(props.children, child =>
    {
        if (React.isValidElement(child))
        {
            return React.cloneElement(child, {changeUser});
        }
        return child;
    });

    return (
        <>
            <UserContext.Provider value={user}>
                {PageLoaded
                    ?
                    <main style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <Header sections={[]} title="Ctice" />
                        <Box sx={{ mt: 3, mb: 3, flex: 1 }} >{childrenWithProps}</Box>
                        {/* <Footer /> */}
                    </main>
                    :
                    <Box sx={{ position: "absolute", top: "50%", left: "50%" }} >
                        <Loading />
                    </Box>
                }
            </UserContext.Provider>
        </>
    )
}