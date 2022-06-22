import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    Bar: {
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        margin: "auto",
        alignItems: "center",
        ["@media (max-width:510px)"]: {
            flexWrap: "wrap",
            justifyContent: "center"
        },
        "& button": {
            color: theme.palette.tertiary.main
        }
    },
    Grid: {
        margin: "auto!important",
        width: "90vw!important",
    },
    ListCompact: {
        margin: "auto",
        marginTop: 20,
        width: "100%",
        paddingBottom: "50px",
        // display: "grid",
        // gridTemplateColumns: "repeat(auto-fill, 220px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gridGap: "20px",
    },
    ListFull: {
        margin: "auto",
        marginTop: 20,
        width: "100%",
        paddingBottom: "50px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, 220px)",
        justifyContent: "center",
        gridGap: "20px",
    },
}));

export default useStyles;