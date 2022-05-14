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
        padding: "30px",
        width: "30%",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
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
        height: 2,
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: theme.line,
        alignSelf: "stretch"
    },
    Vote: {
        display: "flex",
        justifyContent: "top",
        flexDirection: "column",
        textAlign: "center",
    },
    VoteBtn: {
        "&:hover": {
            color: theme.palette.base.main,
        },
        fontSize: 55,
        marginBottom: -10,
        marginTop: -10,
    },
    Title: {
        display: "flex",
        justifyContent: "left"
    }
}));

export default useStyles;