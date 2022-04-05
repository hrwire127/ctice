import React, { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf';
import { ButtonGroup, Button, Box, Typography, IconButton } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import useStyles from '../assets/styles/_DocumentView';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function DocumentView(props)
{
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const { title, _id, description } = props;
    const classes = useStyles();

    function onDocumentLoadSuccess({ numPages })
    {
        setNumPages(numPages);
    }

    const { pdf } = props;

    return (
        <Document
            file={pdf} //todo source
            onLoadSuccess={onDocumentLoadSuccess}
            className={classes.Document}
        >
            <Box className={classes.ToolBar}>
                <Typography variant="h4" >{pageNumber} of {numPages}</Typography>
                <ButtonGroup aria-label="button group" >
                    <IconButton onClick={() => setPageNumber(pageNumber > 1 ? pageNumber - 1 : pageNumber)}><Remove></Remove></IconButton>
                    <IconButton onClick={() => setPageNumber(pageNumber < 1 ? pageNumber + 1 : pageNumber)}><Add></Add></IconButton>
                </ButtonGroup>
            </Box >
            <Page pageNumber={pageNumber} className={classes.Content} />
        </Document >
    )
}

export default DocumentView
