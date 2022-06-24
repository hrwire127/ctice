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
        ["@media (max-width:520px)"]: {
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
        paddingBottom: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
    },
    ListFull: {
        margin: "auto",
        marginTop: 20,
        width: "100%",
        paddingBottom: 50,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, 220px)",
        justifyContent: "center",
        gap: 20,
    },
}));

export default useStyles;