import React, { useState } from 'react'
import Banners from "../Banners"
import { Toolbar, Container, Grid, Paper } from '@mui/material';
import { getBanners } from "../../utilsCS/_get"
import useLoading from '../hooks/useLoading'
import Redirects_CS from '../../utilsCS/CS_Redirects'
import handleAsync from '../custom/handleAsync'

function AdminBanners(props) 
{
    const { setError } = props
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
                    Redirects_CS.handleRes(res, typeof window !== "undefined" && window, setError)
                    const newBanners = await getBanners()
                    Redirects_CS.handleRes(newBanners, typeof window !== "undefined" && window, setError)
                    setBanners(newBanners.obj)
                })
        })
    }

    return (<>
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{
                        p: 2, display: 'flex', flexDirection: 'column',
                        overflow: "auto"
                    }}>
                        {switchLoading(0, () => { if (banners.length > 0) return (<Banners setError={setError} banners={banners} onDelete={onDelete} />) })}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    </>
    )
}

export default AdminBanners