import * as React from 'react';
import { Toolbar, IconButton, Container, Grid, Paper } from '@mui/material';
import { Add, ExitToApp, AppRegistration, Login } from '@mui/icons-material';
import { LogoutFetch, } from '../utilsCS/_get'
import Chart from './Chart';
import Declrs from './Declrs';
import Link from 'next/link'

function AdminIndex(props)
{
    const { users, declarations, setError } = props;

    const Logout = async () =>
    {
        const res = await LogoutFetch()
        if (res.error) return setError(res.error)
    }

    return (
        <>
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
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
                                        <Link href="/create"><IconButton><Add color="tertiary" /></IconButton></Link>
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
                                        <IconButton onClick={Logout}><ExitToApp color="tertiary" /></IconButton>
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
                                        <Link href="/user/login"><IconButton><Login color="tertiary" /></IconButton></Link>
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
                                        <Link href="/user/register"><IconButton><AppRegistration color="tertiary" /></IconButton></Link>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            <Declrs setError={setError} declarations={declarations.slice(0, process.env.DOCS_LOAD_LIMIT)} noControlls />
                            {declarations.length > process.env.DOCS_LOAD_LIMIT &&
                                (<Link color="primary" href="/admin/declrlist" sx={{ mt: 3 }}>
                                    See more declarations
                                </Link>)
                            }
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}

export default AdminIndex