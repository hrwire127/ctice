import React from 'react'
import
{
    Link
} from "@mui/material";
import { useRouter } from 'next/router'

function BackLink(props)
{
    const router = useRouter();
    
    return (
        <Link sx={{
            '&:hover': {
                cursor: "pointer",
            },
        }} onClick={() => router.back()}>{props.children}</Link>
    )
}

export default BackLink