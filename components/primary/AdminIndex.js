import React, { useContext, useEffect, useState } from 'react'
import { Toolbar, IconButton, Container, Grid, Paper, Box, Typography } from '@mui/material'
import DeviceContext from '../context/contextDevice'
import AdminChart from '../AdminChart'
import AdminDeclrsList from '../AdminDeclrsList'
import Link from 'next/link'

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
                    <AdminDeclrsList setError={setError} declarations={declarations.slice(0, device.doclimit)} noControlls />
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