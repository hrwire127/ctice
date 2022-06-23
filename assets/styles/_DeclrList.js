import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    Bar: {
        display: "flex",
        justifyContent: "space-between",
        width: "85%",
        margin: "20px auto",
        alignItems: "center",
        flexWrap: "wrap",
        "& button": {
            color: theme.palette.tertiary.main
        },
        ["@media (max-width:460px)"]: {
            justifyContent: "center",
            flexDirection: "column",
        },
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