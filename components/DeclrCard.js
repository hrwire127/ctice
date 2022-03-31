import React from 'react'
import 'draft-js/dist/Draft.css';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import { CardActions, Box, Card, CardContent, Button, Typography } from '@mui/material'
import useStyles from "../assets/styles/_DeclrCard"
import { CropData } from '../utils/clientFunc';
import Link from 'next/link'



function DeclrCard(props) 
{
    const { title, _id, description } = props;
    const classes = useStyles();

    const data = CropData(JSON.parse(description), 6);
    const editorState = EditorState.createWithContent(convertFromRaw(data))

    return (
        <Card className={classes.Card}>
            <CardContent sx={{ height: 170 }}>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {title}
                </Typography>
                <Editor readOnly={true} editorState={editorState} />
            </CardContent>
            <CardActions className={classes.Actions} sx={{zIndex: 'modal'}}>
                <Link href={`/view/${_id}`}><Button size="small">View</Button></Link>
                <Link href={`/edit/${_id}`}><Button size="small">Edit</Button></Link>
            </CardActions>
        </Card>
    )
}

export default DeclrCard
