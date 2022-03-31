import React from 'react';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import { Box, ButtonGroup, Button, Card, Typography, CardContent } from '@mui/material';
import { Construction, ArrowBack, Delete } from '@mui/icons-material';
import DocumentView from '../components/DocumentView';
import { CropData } from '../utils/clientFunc';
import Link from 'next/link'
import useStyles from '../assets/styles/_DeclrView';



function DeclrView(props)
{

    const { declaration, onDelete } = props;
    const { title, description, file } = declaration;
    const { _id } = declaration;
    const classes = useStyles();

    const data = CropData(JSON.parse(description), 6);
    const editorState = EditorState.createWithContent(convertFromRaw(data))

    return (
        <Box className='h-75'>
            <Box className={classes.Content}>
                <Box className={classes.Paragraph}>
                    <Typography variant="h3">
                        {title}
                    </Typography>
                    <Editor readOnly={true} editorState={editorState} />
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
                    <Card sx={{ minWidth: 275 }}>
                        <CardContent>
                            <Typography sx={{ fontSize: 30}} color="text.secondary" align="center" gutterBottom>
                                {file.name}
                            </Typography>
                        </CardContent>
                    </Card>
                    <ButtonGroup
                        variant="outlined"
                        aria-label="outlined button group"
                        className={classes.BtnGroup}
                        sx={{ p: 2 }}
                    >
                        <Link href={`/edit/${_id}`}><Button className={classes.FlexFill}><Construction /></Button></Link>
                        <Button onClick={onDelete} className={classes.FlexFill} ><Delete /></Button>
                    </ButtonGroup >
                    <DocumentView pdf={file ? file.url : ""} {...declaration} />
                </Card >
            </Box>
        </Box >
    )
}

export default DeclrView;
