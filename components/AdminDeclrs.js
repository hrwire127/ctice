import * as React from 'react';
import { Toolbar, Container, Grid, Paper } from '@mui/material';
import Declrs from './Declrs';
import useLoading from '../../components/hooks/useLoading'

function AdminDeclrs(props)
{
    const [loadingWhile, switchLoading] = useLoading(false)
    const [declarations, setDeclrs] = useState(props.declarations)

    const onDelete = async (e, id) =>                                                                           
    {
        e.preventDefault();
        loadingWhile(async () =>
        {
            await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(response => response.json())
                .then(async () =>
                {
                    CS_Redirects.tryResCS(res, window)
                    const newDeclrs = await getDeclrs() //to do load more
                    CS_Redirects.tryResCS(newDeclrs, window)
                    setDeclrs(newDeclrs.obj)
                })
        })

    }

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