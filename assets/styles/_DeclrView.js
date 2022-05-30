import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    BtnGroup: {
        margin: "auto",
        display: "flex",
        justifyContent: "space-between",
        width: "200px",
    },
    FlexFill: {
        flex: "1 1 auto !important",
    },
    Paragraph: {
        // padding: "30px",
        // display: "flex",
        // flexDirection: "column",
        // gap: "20px",
        width: "100%",
        display: "flex",
        justifyContent: "space-evenly"
    },
    Bar: {
        display: "flex",
        justifyContent: "space-between",
    },
    Content: {
        display: "flex",
        justifyContent: "space-evenly",
    },
    FullWidth: {
        width: '100%'
    },
    Line: {
        width: "100%",
        height: 1,
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: theme.line,
        alignSelf: "stretch"
    },
    Title: {
        display: "flex",
        justifyContent: "left"
    }
}));

export default useStyles;