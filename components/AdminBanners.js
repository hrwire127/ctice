import React, { useState } from 'react'
import Banners from "./Banners"
import { Toolbar, Container, Grid, Paper } from '@mui/material';
import { getBanners } from "../utilsCS/_get"
import CS_Redirects from '../utilsCS/CS_Redirects'
import useLoading from './hooks/useLoading'

function AdminBanners(props)
{
    const [loadingWhile, switchLoading] = useLoading(false)
    const [banners, setBanners] = useState(props.banners)

    const onDelete = async (e, id) =>                                                                           
    {
        e.preventDefault();
        loadingWhile(async () =>
        {
            await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/banner/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(response => response.json())
                .then(async () =>
                {
                    CS_Redirects.tryResCS(res, window)
                    const newBanners = await getBanners()
                    CS_Redirects.tryResCS(newBanners, window)
                    setBanners(newBanners.obj)
                })
        })

    }

    return (<>
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        {switchLoading(0, () => { if (banners.length > 0) return (<Banners banners={banners} onDelete={onDelete} />) })}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    </>
    )
}

export default AdminBanners