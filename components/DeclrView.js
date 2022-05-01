import React, { useState } from 'react';
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import { Box, Typography, IconButton } from '@mui/material';
import { Delete, Build } from '@mui/icons-material';
import DocumentView from '../components/DocumentView';
import { CropData } from '../utilsCS/_client';
import Link from 'next/link'
import useStyles from '../assets/styles/_DeclrView';
import UserContext from './context/contextUser'
import AdminContext from './context/contextAdmin'
import BackLink from "./BackLink";

function DeclrView(props)
{

    const { declaration, onDelete } = props;
    console.log(declaration)
    const { title, description, file, date, author, _id } = declaration;
    const userCtx = React.useContext(UserContext);
    const adminCtx = React.useContext(AdminContext);

    const classes = useStyles();

    const data = CropData(JSON.parse(description), 6);
    const editorState = EditorState.createWithContent(convertFromRaw(data))

    const Placeholder = (
        <Typography variant="h4" component="h5" color="text.secondary" sx={{ marginTop: 10 }}>
            No Upload...
        </Typography>)

    return (
        <Box className='h-75'>
            <Box className={classes.Content}>
                <Box className={classes.Paragraph}>
                    <Box sx={{ display: "flex", justifyContent: "left" }}>
                        <Typography variant="h4">
                            {title}
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center", marginLeft: "10%" }}>
                            {adminCtx && (
                                <>
                                    <Link href={`/edit/${_id}`}><IconButton size="small"><Build /></IconButton></Link>
                                    <Link href=""><IconButton onClick={onDelete} size="small"><Delete /></IconButton></Link>
                                </>
                            )}
                        </Box>
                    </Box>

                    <Editor editorKey="editor" readOnly={true} editorState={editorState} />
                    <Typography variant="h9" color="text.secondary">
                        {date[date.length - 1].match(/\d\d:\d\d/)} _ {date[date.length - 1].substring(0, 10)}
                    </Typography>
                    <Box display="flex" justifyContent="left" gap={1} alignItems="center">
                        <Typography variant="h8" component="h8" color="text.secondary">
                            by {author.username}
                        </Typography>
                        <Typography variant="h8" component="h8" color="green"> {author.status} </Typography>
                    </Box>
                    <BackLink>Back</BackLink>
                </Box>
                {file ? (<DocumentView file={file} />) : Placeholder}
            </Box>
        </Box >
    )
}
export default DeclrView;
