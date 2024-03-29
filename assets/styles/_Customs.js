import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(theme => ({
    Body: {
        flexGrow: 1,
        padding: "24px",
        maxWidth: theme.containerMaxWidth
    },
    Container: {
        display: "flex",
        justifyContent: "space-evenly",
        ["@media (max-width:600px)"]: {
            flexDirection: "column",
            justifyContent: "center",
            gap: 10,
            alignItems: "center",
        },
    },
    Heading: {
        marginBottom: 4,
        ["@media (max-width:600px)"]: {
            textAlign: "center",
            marginBottom: 8,
            fontSize: 40
        },
    }
}));


export default useStyles;