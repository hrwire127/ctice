import React, { useState } from 'react';
import { Toolbar, Container, Grid, Paper } from '@mui/material';
import Declrs from './Declrs';
import useLoading from './hooks/useLoading'
import handleAsync from './custom/handleAsync'
import Redirects_CS from '../utilsCS/CS_Redirects'

function AdminDeclrs(props)
{
    const { setError } = props
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
                    Redirects_CS.handleRes(res, typeof window !== "undefined" && window, setError, setError)
                    const newDeclrs = await getDeclrs() //to do load more
                    Redirects_CS.handleRes(newDeclrs, typeof window !== "undefined" && window, setError, setError)
                    setDeclrs(newDeclrs.obj)
                })
        })

    }

    return (<>
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', 
                    overflow: "auto" }}>
                        {switchLoading(0, () => { if (declarations.length > 0) return (<Declrs setError={setError} declarations={declarations} onDelete={onDelete} />) })}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    </>
    )
}

export default AdminDeclrs