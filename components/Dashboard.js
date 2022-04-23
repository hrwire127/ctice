import * as React from 'react';
import { Toolbar, IconButton, Container, Grid, Paper } from '@mui/material';
import { Add, ExitToApp, AppRegistration, Login } from '@mui/icons-material';
import { logout } from '../utilsCS/_client'
import Chart from './Chart';
import Declrs from './Declrs';
import Link from 'next/link'

function Dashboard(props)
{
    const Logout = () =>
    {
        logout(window)
    }
    const { users, declarations } = props;
    return (
        <>
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    {/* Chart */}
                    <Grid item xs={12} md={8} lg={9}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 240,
                            }}
                        >
                            <Chart users={users} />
                        </Paper>
                    </Grid>
                    {/* Recent Deposits */}
                    <Grid item xs={10} md={4} lg={3}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 240,
                            }}
                        >
                            <Grid container spacing={3}>
                                <Grid item xs={10} md={4} lg={6}>
                                    <Paper
                                        sx={{
                                            display: 'flex',
                                            alignItems: "center",
                                            height: 90,
                                            justifyContent: "center"
                                        }}
                                    >
                                        <Link href="/create"><IconButton><Add /></IconButton></Link>
                                    </Paper>
                                </Grid>
                                <Grid item xs={10} md={4} lg={6}>
                                    <Paper
                                        sx={{
                                            display: 'flex',
                                            alignItems: "center",
                                            height: 90,
                                            justifyContent: "center"
                                        }}
                                    >
                                        <IconButton onClick={Logout}><ExitToApp /></IconButton>
                                    </Paper>
                                </Grid>
                                <Grid item xs={10} md={4} lg={6}>
                                    <Paper
                                        sx={{
                                            display: 'flex',
                                            alignItems: "center",
                                            height: 90,
                                            justifyContent: "center"
                                        }}
                                    >
                                        <Link href="/user/login"><IconButton><Login /></IconButton></Link>
                                    </Paper>
                                </Grid>
                                <Grid item xs={10} md={4} lg={6}>
                                    <Paper
                                        sx={{
                                            display: 'flex',
                                            alignItems: "center",
                                            height: 90,
                                            justifyContent: "center"
                                        }}
                                    >
                                        <Link href="/user/register"><IconButton><AppRegistration /></IconButton></Link>
                                    </Paper>
                                </Grid>
                            </Grid>

                        </Paper>
                    </Grid>
                    {/* Recent Orders */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            <Declrs declarations={declarations.slice(0, 2)} />
                            <Link color="primary" href="/admin/declrlist" sx={{ mt: 3 }}>
                                See more orders
                            </Link>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}

export default Dashboard