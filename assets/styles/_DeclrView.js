import { makeStyles } from '@mui/styles';

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

export default useStyles;