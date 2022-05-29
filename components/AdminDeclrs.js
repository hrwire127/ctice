import * as React from 'react';
import { Toolbar, IconButton, Container, Grid, Paper } from '@mui/material';
import Declrs from './Declrs';

function AdminDeclrs(props)
{
    const { declarations, switchLoading, onDelete } = props;
    return (<>
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        {switchLoading(0, () => { if (declarations.length > 0) return (<Declrs declarations={declarations} onDelete={onDelete}/>) })}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    </>
    )
}

export default AdminDeclrs