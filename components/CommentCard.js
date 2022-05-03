import React, { useState, useEffect } from 'react'
import 'draft-js/dist/Draft.css';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import { CardActions, Box, Card, CardContent, Button, Typography, IconButton } from '@mui/material'
import useStyles from "../assets/styles/_CommentCard"
import { CropData, getDateDifference } from '../utilsCS/_client';
import UserContext from './context/contextUser'
import { Build, Delete } from '@mui/icons-material';

function CommentCard(props)
{
    const { _id, content, date, author, setEdit, handleDelete } = props;
    const [initDiff, setInitialDiff] = useState()
    const [diff, setDiff] = useState()
    const classes = useStyles();
    const userCtx = React.useContext(UserContext);

    const data = JSON.parse(content)
    const editorState = EditorState.createWithContent(convertFromRaw(data))

    useEffect(() =>
    {
        setInitialDiff(getDateDifference(new Date(), new Date(date[0])))
        setDiff(getDateDifference(new Date(), new Date(date[date.length - 1])))
    }, [])

    return (
        <Card className={classes.Card}>
            <CardContent sx={{ height: 160}}>
                <Box sx={{display: "flex", justifyContent: "space-between"}}>
                    <Typography className={classes.Title} color="text.secondary" gutterBottom>
                        {author.username}
                    </Typography>
                    {userCtx === author.username && (
                        <Box sx={{position: "absolute", marginLeft: 16}}>
                            <IconButton size="small" onClick={setEdit.bind(false)}><Build className={classes.Icon} /></IconButton>
                            <IconButton size="small" onClick={handleDelete}><Delete className={classes.Icon} /></IconButton>
                        </Box>
                    )}
                </Box>
                <Editor editorKey="editor" readOnly={true} editorState={editorState} />
            </CardContent>
            <CardActions className={classes.Actions} sx={{ zIndex: 'modal' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography sx={{ margin: 0 }} variant="h9" color="text.secondary" gutterBottom>
                        Created {initDiff}
                    </Typography>
                    <Typography sx={{ margin: 0 }} variant="h9" color="text.secondary" gutterBottom>
                        Edited {diff}
                    </Typography>
                </Box>
            </CardActions>
        </Card>
    )
}

export default CommentCard