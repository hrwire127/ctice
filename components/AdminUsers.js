import * as React from 'react';
import { Toolbar, IconButton, Container, Grid, Paper } from '@mui/material';
import Users from './Users';

function AdminUsers(props)
{
    const { users } = props;
    return (<>
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{
                        p: 2, display: 'flex', flexDirection: 'column',
                        overflow: "auto"
                    }}>
                        <Users users={users} />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    </>
    )
}

export default AdminUsers