import React, { useState, useEffect } from 'react'
import 'draft-js/dist/Draft.css';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import { CardActions, Box, Card, CardContent, Button, Typography, IconButton } from '@mui/material'
import useStyles from "../assets/styles/_CommentCard"
import { CropData, getDateDifference } from '../utilsCS/_client';
import UserContext from './context/contextUser'
import { Build, Visibility } from '@mui/icons-material';

function CommentCard(props)
{
    const { content, date, author } = props;
    const [diff, setDiff] = useState()
    const classes = useStyles();
    const userCtx = React.useContext(UserContext);

    const data = JSON.parse(content)
    const editorState = EditorState.createWithContent(convertFromRaw(data))

    useEffect(() =>
    {
        setDiff(getDateDifference(new Date(), new Date(date[date.length - 1])))
    }, [])

    return (
        <Card className={classes.Card}>
            <CardContent sx={{ height: 160 }}>
                <Typography className={classes.Title} color="text.secondary" gutterBottom>
                    {author.username}
                </Typography>
                <Editor editorKey="editor" readOnly={true} editorState={editorState} />
            </CardContent>
            <CardActions className={classes.Actions} sx={{ zIndex: 'modal' }}>
                <Typography sx={{ margin: 0 }} variant="h9" color="text.secondary" gutterBottom>
                    {diff} ago
                </Typography>
                {/* {userCtx && (
                    <Build />
                )} */}
            </CardActions>
        </Card>
    )
}

export default CommentCard