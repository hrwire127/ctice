import React from 'react'
import 'draft-js/dist/Draft.css';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import { CardActions, Box, Card, CardContent, Button, Typography, IconButton } from '@mui/material'
import { Build, Visibility } from '@mui/icons-material';
import useStyles from "../assets/styles/_DeclrCard"
import { CropData } from '../utils/clientFunc';
import Link from 'next/link'



function DeclrCard(props) 
{
    const { title, _id, description, date } = props;
    const classes = useStyles();

    const data = CropData(JSON.parse(description), 6);
    const editorState = EditorState.createWithContent(convertFromRaw(data))

    return (
        <Card className={classes.Card}>
            <CardContent sx={{ height: 163 }}>
                <Typography className={classes.Title} color="text.secondary" gutterBottom>
                    {title}
                </Typography>
                <Editor readOnly={true} editorState={editorState} />
            </CardContent>
            <CardActions className={classes.Actions} sx={{ zIndex: 'modal' }}>
                <Box>
                    <Link href={`/edit/${_id}`}>
                        <IconButton size="small"><Build className={classes.Icon} /></IconButton>
                    </Link>
                    <Link href={`/view/${_id}`}>
                        <IconButton size="small"><Visibility className={classes.Icon} /></IconButton>
                    </Link>
                </Box>
                <Typography sx={{margin: 0}} variant="h9" color="text.secondary" gutterBottom>
                    {date}
                </Typography>
            </CardActions>
        </Card>
    )
}

export default DeclrCard
