import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(theme => ({
    Container: {
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
    },
    Form: {
        width: "100%",
        marginTop: 8,
    },
    Line: {
        width: "100%",
        height: 1,
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: theme.line,
        alignSelf: "stretch"
    },
}));


export default useStyles;