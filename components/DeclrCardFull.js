import React, { useState } from 'react'
import 'draft-js/dist/Draft.css';
import useStyles from "../assets/styles/_DeclrCardFull"
import { CropData, getDateDifference } from '../utilsCS/_basic';
import Link from 'next/link'
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import { Box, CardActions, Card, CardContent, Typography } from '@mui/material'
import EditorView from './EditorView';

function DeclrCardFull(props) 
{
    const { title, _id: id, description, date } = props;
    const classes = useStyles();

    const likes = props.likes.filter(el => el.typeOf === true)
    const dislikes = props.likes.filter(el => el.typeOf === false)
    const diff = getDateDifference(new Date(), new Date(date[date.length - 1]))

    return ( 
        <Card className={classes.Card}>
            <CardContent className={classes.Upper}>
                <Box className={classes.Top}>
                    <Typography className={classes.Title} color="text.secondary" gutterBottom>
                        <Link href={`/view/${id}`}>
                            {title}
                        </Link>
                    </Typography>
                    <Typography color={likes.length === dislikes.length ? "text.default" : (likes.length > dislikes.length ? "text.success" : "text.error")} variant="h6">
                        {likes.length - dislikes.length}
                    </Typography>
                </Box>
                <EditorView data={JSON.parse(description)} />
            </CardContent>
            <CardActions className={classes.Actions} sx={{ zIndex: 'modal' }}>
                <Typography sx={{ margin: 0 }} variant="h9" color="text.secondary" gutterBottom>
                    {diff} ago
                </Typography>
            </CardActions>
        </Card>
    )
}

export default DeclrCardFull