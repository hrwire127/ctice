import React from 'react'
import
{
    Link
} from "@mui/material";
import { useRouter } from 'next/router'
import useStyles from '../assets/styles/_BackLink';

function BackLink(props)
{
    const router = useRouter();
    const classes = useStyles();

    return (
        <Link
            className={classes.Link}
            onClick={() => router.back()}
        >
            {props.children}
        </Link>
    )
}

export default BackLink