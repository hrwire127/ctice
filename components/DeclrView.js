import React from 'react';
import { Box, ButtonGroup, Button, Card, Typography, CardContent } from '@mui/material';
import { Construction, ArrowBack, Delete } from '@mui/icons-material';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import { CropData } from '../utils/commonFunc';
import { makeStyles } from '@mui/styles';
import DocumentView from '../components/DocumentView';
import Link from 'next/link'



const useStyles = makeStyles({
    BtnGroup: {
        margin: "auto",
        display: "flex",
        justifyContent: "space-between",
        width: "200px",
    },
    FlexFill: {
        flex: "1 1 auto !important",
    },
    Document: {
    },
    Paragraph: {
        padding: "30px",
        width: "30%",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
    },
    Content: {
        display: "flex",
        justifyContent: "space-evenly",
    }
});


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
