import React, { useContext, useEffect, useState } from 'react'
import { Toolbar, IconButton, Container, Grid, Paper, Box } from '@mui/material'
import { Add, ExitToApp, AppRegistration, Login } from '@mui/icons-material'
import { LogoutFetch, } from '../../utilsCS/_get'
import DeviceContext from '../context/contextDevice'
import AdminChart from '../AdminChart'
import AdminDeclrs from '../AdminDeclrs'
import Link from 'next/link'
import Redirects_CS from '../../utilsCS/CS_Redirects'

function AdminIndex(props)
{
    const { users, declarations, setError } = props;
    const device = useContext(DeviceContext)

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
                    <AdminChart users={users} />
                </Paper>

                <Paper className="rec-declrs" sx={{
                    p: 2,
                    m: 6,
                    width: "90%",
                    overflow: "auto"
                }}>
                    <AdminDeclrs setError={setError} declarations={declarations.slice(0, device.doclimit)} noControlls />
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