import { Box } from '@mui/material';
import Navbar from "./Navbar"
import Footer from './Footer'
import Loading from './Loading'
import Header from './Header'

import { useEffect, useState } from 'react'


const sections = [
    { title: 'Home', url: '/' },
    { title: 'Create', url: '/create' },
    { title: 'News', url: '#' },
    { title: 'More', url: '#' },
];

export default function Layout(props)
{
    const [PageLoaded, setPageLoaded] = useState(false)
    useEffect(() => { setPageLoaded(true) }, []);

    return (
        <>
            {PageLoaded
                ?
                <main style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    {/* <Navbar /> */}
                    <Header sections={sections} title="Ctice" />
                    <Box sx={{ mt: 3, mb: 3, flex: 1 }} >{props.children}</Box>
                    <Footer />
                </main>
                :
                <Loading />
            }
        </>
    )
}