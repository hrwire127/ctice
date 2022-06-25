import React, { useContext, useEffect, useState } from 'react';
import { Toolbar, IconButton, Container, Grid, Paper, Box } from '@mui/material';
import { Add, ExitToApp, AppRegistration, Login } from '@mui/icons-material';
import { LogoutFetch, } from '../utilsCS/_get'
import DeviceContext from './context/contextDevice'
import Chart from './Chart';
import Declrs from './Declrs';
import Link from 'next/link'
import useWindowSize from './hooks/useWindowSize';
import Redirects_CS from '../utilsCS/CS_Redirects'

function AdminIndex(props)
{
    const { users, declarations, setError } = props;
    const device = useContext(DeviceContext)
    const [windowSize] = useWindowSize();

    // useEffect(() =>
    // {
    //     const container = document.querySelector('.rec-declrs')
    //     if (windowSize < 880)
    //     {

    //         console.log(container.offsetWidth)
    //         console.log(window.innerWidth)
    //         const scale = window.innerWidth / 100 * 80 / 688

    //         container.style.width = "688px"
    //         container.style.transformOrigin = "center center"
    //         console.log(scale)
    //         container.style.transform = "scale(" + (scale) + ")"
    //         // container.style.transform
    //     }
    //     else
    //     {
    //         container.style.position = "block"
    //         container.style.width = "90%"
    //         container.style.left = "0%"
    //         container.style.top = "0%"
    //         container.style.transform = "translate(0%, 0%) " + "scale(1)"
    //     }
    // }, [windowSize])


    return (
        <>
            <Toolbar />
            <Box sx={{
                position: "relative",
                maxWidth: theme => theme.containerMaxWidth
            }}>
                <Paper
                    sx={{
                        m: 6,
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 240,
                        width: "90%"
                    }}
                >
                    <Chart users={users} />
                </Paper>

                <Paper className="rec-declrs" sx={{
                    p: 2,
                    m: 6,
                    width: "90%",
                    overflow: "auto"
                }}>
                    <Declrs setError={setError} declarations={declarations.slice(0, device.doclimit)} noControlls />
                    {declarations.length > device.doclimit &&
                        (<Link color="primary" href="/admin/declrlist" sx={{ mt: 3 }}>
                            See more declarations
                        </Link>)
                    }
                </Paper>
            </Box>
        </>
    )
}

export default AdminIndex