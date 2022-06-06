import React, { useEffect, useState } from 'react'
import 'draft-js/dist/Draft.css';
import useStyles from "../assets/styles/_DeclrCardFull"
import { CropData, getDateDifference } from '../utilsCS/_basic';
import Link from 'next/link'
import { Build, Visibility } from '@mui/icons-material';
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import { Box, CardActions, Card, CardContent, Typography, IconButton } from '@mui/material'
import UserContext from './context/contextUser'

function DeclrCardFull(props) 
{
    const { title, _id: id, description, date } = props;
    const classes = useStyles();

    const data = CropData(JSON.parse(description), 6);
    const editorState = EditorState.createWithContent(convertFromRaw(data))

    return (
        <Card className={classes.Card}>
            <CardContent sx={{ height: 160 }}>
                <Typography className={classes.Title} color="text.secondary" gutterBottom>
                    <Link href={`/view/${id}`}>
                        {title}
                    </Link>
                </Typography>
                <Editor editorKey="editor" readOnly={true} editorState={editorState} />
            </CardContent>
            <CardActions className={classes.Actions} sx={{ zIndex: 'modal' }}>
                <Typography sx={{ margin: 0 }} variant="h9" color="text.secondary" gutterBottom>
                    {date[date.length - 1]}
                </Typography>
            </CardActions>
        </Card>
    )
}

export default DeclrCardFull