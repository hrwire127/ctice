import React from 'react';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import { Box, ButtonGroup, Button, Card, Typography, CardContent, IconButton } from '@mui/material';
import { Construction, ArrowBack, Delete, Build } from '@mui/icons-material';
import DocumentView from '../components/DocumentView';
import { CropData } from '../utils/clientFunc';
import Link from 'next/link'
import useStyles from '../assets/styles/_DeclrView';



function DeclrView(props)
{

    const { declaration, onDelete } = props;
    const { title, description, file, date } = declaration;
    const { _id } = declaration;
    const classes = useStyles();

    const data = CropData(JSON.parse(description), 6);
    const editorState = EditorState.createWithContent(convertFromRaw(data))

    return (
        <Box className='h-75'>
            <Box className={classes.Content}>
                <Box className={classes.Paragraph}>
                    <Box sx={{ display: "flex", justifyContent: "left" }}>
                        <Typography variant="h3">
                            {title}
                        </Typography>
                        <Box sx={{display: "flex", alignItems: "center", marginLeft: "10%"}}>
                            <Link href={`/edit/${_id}`}><IconButton size="small"><Build  /></IconButton></Link>
                            <Link href=""><IconButton onClick={onDelete} size="small"><Delete /></IconButton></Link>
                        </Box>
                    </Box>

                    <Editor readOnly={true} editorState={editorState} />
                    <Typography variant="h9" color="text.secondary">
                        {date}
                    </Typography>
                    <Link href="/" sx={{ p: 5 }}>
                        Back
                    </Link>
                </Box>
                <Card
                    className={classes.Document}
                    sx={{
                        mb: 5,
                        mt: 5,
                    }}
                >
                    <Card sx={{ minWidth: 275, marginBottom: 10 }}>
                        <CardContent>
                            <Typography sx={{ fontSize: 30 }} color="text.secondary" align="center" gutterBottom>
                                {file && file.name}
                            </Typography>
                        </CardContent>
                    </Card>
                    <DocumentView pdf={file ? file.url : ""} {...declaration} />
                </Card >
            </Box>
        </Box >
    )
}

export default DeclrView;
