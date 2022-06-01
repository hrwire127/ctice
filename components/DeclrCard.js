import React, { useEffect, useState } from 'react'
import 'draft-js/dist/Draft.css';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import { Box, Typography, Paper } from '@mui/material'
import useStyles from "../assets/styles/_DeclrCard"
import { CropData, getDateDifference } from '../utilsCS/_client';
import Link from 'next/link'
import UserContext from './context/contextUser'
import AdminContext from './context/contextAdmin'

function DeclrCard(props) 
{
    const { title, _id, description, date } = props;
    const [likes, setLikes] = useState(props.likes.filter(el => el.typeOf === true));
    const [dislikes, setDislikes] = useState(props.likes.filter(el => el.typeOf === false));
    const classes = useStyles();
    const [diff, setDiff] = useState()

    useEffect(() =>
    {
        setDiff(getDateDifference(new Date(), new Date(date[date.length - 1])))
    }, [])

    const userCtx = React.useContext(UserContext);
    const adminCtx = React.useContext(AdminContext);
    const data = CropData(JSON.parse(description), 6);
    const editorState = EditorState.createWithContent(convertFromRaw(data))

    return (
        <Paper className={classes.Card}>
            <Box className={classes.Content}>
                <Typography color={likes.length === dislikes.length ? "text.default" : (likes.length > dislikes.length ? "text.success" : "text.error")} variant="h6">
                    {likes.length - dislikes.length}
                </Typography>
                <Link href={`/view/${_id}`}>
                    <Typography className={classes.Title}>
                        {title}
                    </Typography>
                </Link>
            </Box>
            <Typography sx={{ margin: 0 }} variant="h9" color="text.secondary" gutterBottom>
                {diff} ago
            </Typography>
            {/* <CardActions className={classes.Actions} sx={{ zIndex: 'modal' }}>
                <Box>
                    {adminCtx &&
                        (<Link href={`/edit/${_id}`}>
                            <IconButton size="small"><Build className={classes.Icon} /></IconButton>
                        </Link>)
                    }
                    <Link href={`/view/${_id}`}>
                        <IconButton size="small"><Visibility className={classes.Icon} /></IconButton>
                    </Link>
                </Box>
                <Typography sx={{ margin: 0 }} variant="h9" color="base" gutterBottom>
                    {diff} ago
                </Typography>
            </CardActions> */}
        </Paper>
    )
}

export default DeclrCard
