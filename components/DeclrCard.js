import React, { useEffect, useState } from 'react'
import 'draft-js/dist/Draft.css';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import { CardActions, Box, Card, CardContent, Button, Typography, IconButton } from '@mui/material'
import { Build, Visibility } from '@mui/icons-material';
import useStyles from "../assets/styles/_DeclrCard"
import { CropData, getDateDifference } from '../utilsCS/_client';
import Link from 'next/link'
import UserContext from './context/contextUser'
import AdminContext from './context/contextAdmin'

function DeclrCard(props) 
{
    const { title, _id, description, date } = props;
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
        <Card className={classes.Card}>
            <CardContent className={classes.Content}>
                <Typography className={classes.Title} color="text.secondary" gutterBottom>
                    {title}
                </Typography>
                <Editor editorKey="editor" readOnly={true} editorState={editorState} />
            </CardContent>
            <CardActions className={classes.Actions} sx={{ zIndex: 'modal' }}>
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
            </CardActions>
        </Card>
    )
}

export default DeclrCard
