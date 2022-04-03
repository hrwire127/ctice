import { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import Footer from './Footer'
import Loading from './Loading'
import Header from './Header'

export default function Layout(props)
{
    const [PageLoaded, setPageLoaded] = useState(false)
    useEffect(() => { setPageLoaded(true) }, []);

    return (
        <>
            {PageLoaded
                ?
                <main style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <Header sections={[]} title="Ctice" />
                    <Box sx={{ mt: 3, mb: 3, flex: 1 }} >{props.children}</Box>
                    {/* <Footer /> */}
                </main>
                :
                <Loading />
            }
        </>
    )
}