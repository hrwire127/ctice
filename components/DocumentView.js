import React, { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf';
import { ButtonGroup, Button, Box, Typography } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const useStyles = makeStyles({
    Document: {
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center"
    },
    ToolBar: {
        display: "flex",
        justifyContent: "space-evenly",
        width: "100%"
    },
    Content: {
        display: "flex",
        justifyContent: "center",
        "& .annotationLayer":
        {
            position: "absolute"
        }
    }
});

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
                <Typography variant="h4" >Page {pageNumber} of {numPages}</Typography>
                <ButtonGroup aria-label="button group" >
                    <Button onClick={() => setPageNumber(pageNumber > 1 ? pageNumber - 1 : pageNumber)} variant="outlined"><Remove></Remove></Button>
                    <Button onClick={() => setPageNumber(pageNumber < 1 ? pageNumber + 1 : pageNumber)} variant="outlined"><Add></Add></Button>
                </ButtonGroup>
            </Box >
            <Page pageNumber={pageNumber} className={classes.Content} />
        </Document >
    )
}

export default DocumentView
