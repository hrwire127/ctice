import React from 'react'
import { CardActions, Box, Card, CardContent, Button, Typography } from '@mui/material'
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import Link from 'next/link'
import { makeStyles } from '@mui/styles';
import { CropData } from '../utils/commonFunc';

const useStyles = makeStyles({
    Card: {
        width: "220px",
        height: "262px",
        position: 'relative'
    },
    Actions: {
        background: "rgb(2, 0, 36)",
        background: "linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 18%)",
        position: "absolute",
        width: "100%",
        height: "60px",
    },
});

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
