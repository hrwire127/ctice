import React, { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf';
import { Box, ButtonGroup, Button, Card, Typography, CardContent, IconButton } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import useStyles from '../assets/styles/_DocumentView';
import Loading from './Loading'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function PdfView(props)
{
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const classes = useStyles();

    function onDocumentLoadSuccess()
    {
        setNumPages(1);
    }

    const { file } = props;

    const Failed = (
        <Typography variant="h4" component="h5"xsx={{ marginTop: 10 }}>
            Failed To Load...
        </Typography>)

    const Content = (
        <>
            <CardContent>
                <Box className={classes.ToolBar}>
                    <Typography variant="h4" >{pageNumber} of {numPages}</Typography>
                    <ButtonGroup aria-label="button group" >
                        <IconButton onClick={() => setPageNumber(pageNumber > 1 ? pageNumber - 1 : pageNumber)}><Remove></Remove></IconButton>
                        <IconButton onClick={() => setPageNumber(pageNumber < 1 ? pageNumber + 1 : pageNumber)}><Add></Add></IconButton>
                    </ButtonGroup>
                </Box >
            </CardContent>
            <Page pageNumber={pageNumber} className={classes.Content} />
        </>
    )

    return (

        <Document
            file={file.url} //todo source
            onLoadSuccess={onDocumentLoadSuccess}
            error={Failed}
            loading={Loading}
            className={classes.Document}
        >
            <Typography sx={{ fontSize: 30, mt: 5 }} color="text.secondary" align="center" gutterBottom>
                {file.name}
            </Typography>
            <Card
                sx={{
                    mb: 5,
                }}>
                {Content}
            </Card>
        </Document >
    )
}
export default PdfView
